from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

SOURCE_URL = "https://www.mm2values.com/?p=recentChanges"
OUT_PATH = Path("data/recent-changes.json")
MIN_DAYS = 10

VALUE_RE = re.compile(
    r"^(?P<name>.+?):\s*V\s*(?:⬆|↑|⬇|↓)\s*\((?P<delta>[+-]?\d+(?:\.\d+)?)\)"
)
SESSION_RE = re.compile(r"^Session:\s*(.+)$", re.I)


def now_utc():
    return datetime.now(timezone.utc)


def parse_dt(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def load_existing():
    if not OUT_PATH.exists():
        return {}
    try:
        return json.loads(OUT_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {}


def due_for_refresh(existing):
    last = parse_dt(existing.get("pulled_at"))
    if not last:
        return True
    return (now_utc() - last).days >= MIN_DAYS


def scrape():
    response = requests.get(
        SOURCE_URL,
        timeout=20,
        headers={
            "User-Agent": (
                "MM2ValuesBotWebsite/1.0 "
                "(+https://mm2values.github.io/mm2-values-bot/)"
            )
        },
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    lines = [
        line.strip()
        for line in soup.get_text("\n").splitlines()
        if line.strip()
    ]

    session = None
    changes = []
    inside_latest_session = False

    for line in lines:
        session_match = SESSION_RE.match(line)

        if session_match:
            if inside_latest_session:
                break
            session = session_match.group(1).strip()
            inside_latest_session = True
            continue

        if not inside_latest_session:
            continue

        value_match = VALUE_RE.match(line)
        if not value_match:
            continue

        delta = float(value_match.group("delta"))
        if delta.is_integer():
            delta = int(delta)

        changes.append(
            {
                "name": value_match.group("name").strip(),
                "delta": delta,
            }
        )

    if not session:
        raise RuntimeError("Could not find the latest MM2Values session.")

    if not changes:
        raise RuntimeError("Latest session contained no parsed value changes.")

    return {
        "source": "MM2Values",
        "source_url": SOURCE_URL,
        "session": session,
        "pulled_at": now_utc().isoformat().replace("+00:00", "Z"),
        "changes": changes,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--force",
        action="store_true",
        help="Refresh even if the last successful pull was less than 10 days ago.",
    )
    args = parser.parse_args()

    existing = load_existing()

    if not args.force and not due_for_refresh(existing):
        print("Recent-changes data is less than 10 days old. Nothing to do.")
        return 0

    data = scrape()

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(
        f"Saved {len(data['changes'])} value changes "
        f"from session {data['session']}."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
