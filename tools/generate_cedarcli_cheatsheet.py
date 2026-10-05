#!/usr/bin/env python3
"""Generate the CEDAR CLI command map as a six-column A4 landscape sheet."""

from __future__ import annotations

import argparse
import re
import subprocess
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


PAGE_WIDTH, PAGE_HEIGHT = landscape(A4)
COLUMN_COUNT = 6
ROW_COUNT = 4
CELL_WIDTH = PAGE_WIDTH / COLUMN_COUNT
CELL_HEIGHT = PAGE_HEIGHT / ROW_COUNT

HEADING_SIZE = 12
BODY_SIZE = 7.8
BODY_LEADING = 10.5
BODY_BOTTOM = 12

RED = HexColor("#B00020")
ORANGE = HexColor("#FF8A00")
GRID = HexColor("#F6A24A")
OUTLINE = HexColor("#FF5C4D")
BLACK = HexColor("#111111")
TEAL = HexColor("#087F78")
PAPER = HexColor("#FFFEFC")

MENLO = "/System/Library/Fonts/Menlo.ttc"
LOGO = Path(__file__).resolve().parents[1] / "assets" / "cedar-logo-image.png"
Entry = str | tuple[str, object]


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Menlo", MENLO, subfontIndex=0))
    pdfmetrics.registerFont(TTFont("MenloBold", MENLO, subfontIndex=1))


def draw_title(c: canvas.Canvas, text: str, x: float, y: float, width: float) -> None:
    c.setFillColor(RED)
    c.setFont("Menlo", HEADING_SIZE)
    c.drawCentredString(x + width / 2, y, text.lower())


def draw_lines(
        c: canvas.Canvas,
        entries: list[Entry],
        x: float,
        top: float,
        leading: float = BODY_LEADING,
        font_size: float = BODY_SIZE,
) -> None:
    c.setFont("MenloBold", font_size)
    y = top
    for entry in entries:
        if isinstance(entry, tuple):
            text, _color = entry
        else:
            text = entry
        c.setFillColor(BLACK)
        c.drawString(x, y, text)
        y -= leading


def panel(
        c: canvas.Canvas,
        column: int,
        row: int,
        heading: str,
        entries: list[Entry] | tuple[list[Entry], list[Entry]],
        *,
        span: int = 1,
        body_size: float = BODY_SIZE,
) -> None:
    x = column * CELL_WIDTH
    y = PAGE_HEIGHT - (row + 1) * CELL_HEIGHT
    width = CELL_WIDTH * span

    c.setFillColor(PAPER)
    c.setStrokeColor(GRID)
    c.setLineWidth(0.8)
    c.setDash(3, 2)
    c.rect(x, y, width, CELL_HEIGHT, stroke=1, fill=1)
    c.setDash()

    draw_title(c, heading, x, y + CELL_HEIGHT - 21, width)
    body_top = y + CELL_HEIGHT - 42

    # A panel with more lines than the standard leading allows tightens it to end at the bottom.
    longest = max(map(len, entries)) if isinstance(entries, tuple) else len(entries)
    leading = BODY_LEADING
    if longest > 1:
        leading = min(BODY_LEADING, (body_top - y - BODY_BOTTOM) / (longest - 1))

    if isinstance(entries, tuple):
        left, right = entries
        draw_lines(c, left, x + 8, body_top, leading, body_size)
        draw_lines(c, right, x + width / 2 + 4, body_top, leading, body_size)
    else:
        draw_lines(c, entries, x + 8, body_top, leading, body_size)



def brand_panel(c: canvas.Canvas, cli_version: str) -> None:
    x = 0
    y = PAGE_HEIGHT - CELL_HEIGHT
    c.setFillColor(PAPER)
    c.setStrokeColor(GRID)
    c.setLineWidth(0.8)
    c.setDash(3, 2)
    c.rect(x, y, CELL_WIDTH, CELL_HEIGHT, stroke=1, fill=1)
    c.setDash()

    logo = ImageReader(LOGO)
    source_width, source_height = logo.getSize()
    logo_width = CELL_WIDTH - 24
    logo_height = logo_width * source_height / source_width
    c.drawImage(
        logo,
        x + 12,
        y + (CELL_HEIGHT - logo_height) / 2 + 10,
        width=logo_width,
        height=logo_height,
        preserveAspectRatio=True,
        mask="auto",
    )
    c.setFillColor(TEAL)
    c.setFont("MenloBold", BODY_SIZE)
    c.drawCentredString(x + CELL_WIDTH / 2, y + 28, "cedarcli commands")
    c.setFont("Menlo", BODY_SIZE)
    c.drawCentredString(x + CELL_WIDTH / 2, y + 15, cli_version)


def latest_cli_version() -> str:
    cli_repository = Path(__file__).resolve().parents[2] / "cedar-cli"
    result = subprocess.run(
        ["git", "tag", "--sort=-version:refname"],
        cwd=cli_repository,
        check=True,
        capture_output=True,
        text=True,
    )
    for tag in result.stdout.splitlines():
        match = re.fullmatch(r"release-(\d+\.\d+\.\d+)", tag)
        if match:
            return match.group(1)
    raise RuntimeError("cedar-cli has no release-X.Y.Z tag")


def draw_sheet(c: canvas.Canvas, cli_version: str) -> None:
    brand_panel(c, cli_version)
    panel(c, 1, 0, "git", [
        ("add-commit-push COMMENT", OUTLINE),
        "  --repo REPO --path PATH...",
        "branch", "checkout BRANCH", "clone all / docker", "clone-missing", "fetch",
        "list branch / tag", ("next", ORANGE), ("pull", ORANGE),
        "remote", ("status", ORANGE),
    ], body_size=6.7)
    panel(c, 2, 0, "build", [
        "[--jobs N] [--workers N] <cmd>",
        ("all [--skip-tests]", ORANGE),
        "<build_target> [--skip-tests]",
        "this [--skip-tests]",
        "split-frontends",
        "  [--server-payload]",
        "server-frontends",
        "  [--server-payload]",
        "diagnostics [--apply]",
        "  [--days N] [--max-mib N]",
        ("maven clean all", ORANGE),
        "maven clean cedar",
    ], body_size=6.7)
    panel(c, 3, 0, "publish", [
        "all | <build_target> | this",
        ("train [--dry-run]", ORANGE),
        "  [--resume TRAIN_ID]",
        "  [--release-version VER]",
        "  [--next-version NEXT_VER]",
        "  [--cee-version CEE_VER]",
        "  [--accept-main-only REPO]",
        "train-status [TRAIN_ID]",
        "  [--watch]",
        "baselines [--refresh] [--all]",
        "  [--repository REPO]",
        "components [--apply]",
        "  [--component ID]",
        "probe [--upload]",
    ], body_size=6.5)
    panel(c, 4, 0, "release", (
        [
            "readiness [--full]",
            "  [--version VER]",
            "  [--next-version NEXT_VER]",
            "  [--from-train TRAIN_ID]",
            "  [--cee-version CEE_VER]",
            "  [--model-version MODEL_VER]",
            "  [--skip-packaging]",
            ("plan", ORANGE),
            "  --version VER",
            "  --next-version NEXT_VER",
            "  --from-train TRAIN_ID",
            "  --cee-version CEE_VER",
            "  [--accept-red-develop REPO=RUN]",
            "  [--accept-main-only REPO]",
        ],
        [
            ("start", ORANGE),
            "  --version VER",
            "  --next-version NEXT_VER",
            "  --from-train TRAIN_ID",
            "  --cee-version CEE_VER",
            "  [--accept-red-develop REPO=RUN]",
            "  [--accept-main-only REPO]",
            "  [--jobs N] [--workers N]",
            "  [--maven-threads N] [--verbose]",
            "resume [--dry-run] [--verbose]",
            "status [--watch]",
            "timings [--compare VER]",
            "abandon",
            "  --version VER --reason WHY",
        ],
    ), span=2, body_size=6.5)

    panel(c, 0, 1, "mode", [
        "native",
        "  --profile develop|server",
        "hybrid",
        "  --profile develop|server",
        "docker",
        "--clear [--force]",
    ], body_size=7.0)
    panel(c, 1, 1, "native", [
        ("status", ORANGE),
        ("start [--refresh-dependencies]", ORANGE),
        "  all | <run_target>",
        ("stop all | <run_target>", ORANGE),
        "restart [--refresh-dependencies]",
        "  all | <run_target>",
        "health [--group GROUP]",
        "  all|microservices|frontends",
        "logs ui-<frontend> [-n LINES]",
        "logs <microservice> [-n LINES]",
        "  [--dropwizard]",
        "watch",
    ], body_size=6.5)
    panel(c, 2, 1, "docker", [
        "status",
        "start",
        "  all [--train TRAIN_ID|--local] [--pull POLICY] [--timeout SEC]",
        ("  <run_target> [--detach] [--train TRAIN_ID|--local] [--pull POLICY]", ORANGE),
        ("  POLICY=never|missing|always", TEAL),
        "stop all | <run_target>",
        "build all | <run_target> | <image>",
        "  [--no-deps] [--local] [--train TRAIN_ID]",
        ("validate", ORANGE),
        "setup one-time-setup | create-network",
        "  create-certificates-volume | copy-certificates",
        ("remove containers | images | network | volumes | all", OUTLINE),
    ], span=3)
    panel(c, 5, 1, "test", [
        ("e2e [--rest-workers N]", ORANGE), "status", "cleanup",
    ])

    panel(c, 0, 2, "<build_target>", [
        "java", "project", "parent", "libraries", "clients",
        "frontends [no --skip-tests]",
    ])
    panel(c, 1, 2, "<run_target>", [
        "infra [start/stop only]",
        "backends [native start/stop]",
        "microservices",
        ("microservice all", ORANGE), "microservice <microservice>",
        "frontends", ("frontend all", ORANGE), "frontend <frontend>",
        "frontend split-frontends",
        "  [native only]",
        "keycloak / kk [start/stop]",
        "admin [docker only]",
    ], body_size=7.0)
    panel(c, 2, 2, "<frontend>", [
        "main", "openview", "monitoring", "bridging", "content", "workspace",
        "designer",
    ])
    panel(c, 3, 2, "<microservice>", (
        ["artifact", "bridge", "group", "impex", "messaging", "monitor", "openview",
         "  [docker: open]"],
        ["repo", "resource", "schema", "submission", "terminology", "user",
         "valuerecommender", "worker"],
    ), span=2)
    panel(c, 5, 2, "prod", [
        "configure-frontends", "reset-frontends", "provision-artifact-key",
    ])

    panel(c, 0, 3, "repo", [("config", ORANGE)])
    panel(c, 1, 3, "check", (
        [
            ("repos", ORANGE),
            ("versions [--strict] [--by-file]", ORANGE),
            "components [--strict] [--all]",
            "snapshots [--version VER]",
            "  [--grace-hours N] [--nexus URL]",
            "ci [--all]",
            "ci-env [--apply]",
            "openapi [--all]",
            "main [--all]",
        ],
        [
            "design-tokens [--repo REPO]",
            "  [--strict] [--all] [--json]",
            "  [--init-baseline]",
            "  [--prune-baseline]",
            "  [--sync-surfaces]",
            "  [--surface-inventory FILE]",
            "artifact-versioning [--apply]",
            "stores",
        ],
    ), span=2, body_size=6.7)
    panel(c, 3, 3, "env", [
        ("status", ORANGE), "list [native|docker]",
        "filter TERM", "  [native|docker]",
        "artifact-key",
        "  init|rotate|retire",
    ])
    panel(c, 4, 3, "cert", [
        "ca [--force]", "domains [NAME...]", "  [--force]", ("setup", ORANGE),
    ])
    panel(c, 5, 3, "dev", [
        ("add-hosts", ORANGE), "copy-keycloak-listener", "create-directories",
        "generate-api-key [USER_ID]",
    ])

    c.setStrokeColor(OUTLINE)
    c.setLineWidth(1.2)
    c.rect(0.6, 0.6, PAGE_WIDTH - 1.2, PAGE_HEIGHT - 1.2, stroke=1, fill=0)


def generate(output_pdf: Path, cli_version: str) -> None:
    register_fonts()
    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output_pdf), pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
                      pageCompression=1)
    c.setTitle("CEDAR CLI Commands")
    c.setAuthor("CEDAR Project")
    c.setSubject("Current cedarcli commands and arguments")
    draw_sheet(c, cli_version)
    c.showPage()
    c.save()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output_pdf", type=Path)
    parser.add_argument("--version", help="cedar-cli release shown in the brand panel")
    args = parser.parse_args()
    generate(args.output_pdf, args.version or latest_cli_version())


if __name__ == "__main__":
    main()
