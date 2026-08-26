"""
Script: _template.py
Purpose: [One-line description of what this script does]
Directive: directives/_template.md

Usage:
    python execution/_template.py --arg1 value1

Inputs:
    --arg1  : Description of arg1

Outputs:
    Describe what the script produces (file path, stdout, etc.)
"""

import argparse
import os
from dotenv import load_dotenv

# ── Load environment variables ────────────────────────────
load_dotenv()

# ── Argument parsing ──────────────────────────────────────
def parse_args():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--arg1", required=True, help="Description of arg1")
    return parser.parse_args()


# ── Core logic ────────────────────────────────────────────
def main(args):
    print(f"Running with arg1={args.arg1}")
    # TODO: implement logic here


# ── Entry point ───────────────────────────────────────────
if __name__ == "__main__":
    args = parse_args()
    main(args)
