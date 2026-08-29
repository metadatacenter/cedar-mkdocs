#!/usr/bin/env python3
"""Generate the CEDAR CLI command map as a six-column A4 landscape sheet."""

from __future__ import annotations

import argparse
import re
import subprocess
from pathlib import Path
from typing import Callable

from reportlab.lib.colors import HexColor, white
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

RED = HexColor("#B00020")
ORANGE = HexColor("#FF8A00")
GRID = HexColor("#F6A24A")
OUTLINE = HexColor("#FF5C4D")
BLACK = HexColor("#111111")
TEAL = HexColor("#087F78")
BLUE = HexColor("#1976B9")
GREEN = HexColor("#16A85B")
PAPER = HexColor("#FFFEFC")

MENLO = "/System/Library/Fonts/Menlo.ttc"
LOGO = Path(__file__).resolve().parents[1] / "assets" / "cedar-logo-image.png"
Entry = str | tuple[str, object]
Icon = Callable[[canvas.Canvas, float, float, float], None]


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


def browser_icon(c: canvas.Canvas, x: float, y: float, scale: float) -> None:
    c.setStrokeColor(TEAL)
    c.setFillColor(HexColor("#E8F5F3"))
    c.setLineWidth(4 * scale)
    c.roundRect(x, y, 86 * scale, 62 * scale, 8 * scale, stroke=1, fill=1)
    c.line(x, y + 45 * scale, x + 86 * scale, y + 45 * scale)
    for offset, color in ((14, OUTLINE), (27, ORANGE), (40, GREEN)):
        c.setFillColor(color)
        c.circle(x + offset * scale, y + 53 * scale, 3.3 * scale, stroke=0, fill=1)


def server_icon(c: canvas.Canvas, x: float, y: float, scale: float) -> None:
    for index, color in enumerate((BLUE, TEAL, GREEN)):
        yy = y + index * 27 * scale
        c.setFillColor(HexColor("#EAF4FA"))
        c.setStrokeColor(color)
        c.setLineWidth(3 * scale)
        c.roundRect(x, yy, 96 * scale, 21 * scale, 5 * scale, stroke=1, fill=1)
        c.setFillColor(color)
        c.circle(x + 12 * scale, yy + 10.5 * scale, 3.3 * scale, stroke=0, fill=1)
        c.circle(x + 24 * scale, yy + 10.5 * scale, 3.3 * scale, stroke=0, fill=1)


def terminal_icon(c: canvas.Canvas, x: float, y: float, scale: float) -> None:
    c.setFillColor(TEAL)
    c.circle(x, y, 43 * scale, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("MenloBold", 24 * scale)
    c.drawCentredString(x, y - 8 * scale, ">_")


def deploy_icon(c: canvas.Canvas, x: float, y: float, scale: float) -> None:
    c.setLineWidth(4 * scale)
    c.setStrokeColor(HexColor("#22313F"))
    c.setFillColor(white)
    points = [
        (x + 45 * scale, y + 88 * scale),
        (x + 84 * scale, y + 66 * scale),
        (x + 84 * scale, y + 22 * scale),
        (x + 45 * scale, y),
        (x + 6 * scale, y + 22 * scale),
        (x + 6 * scale, y + 66 * scale),
    ]
    path = c.beginPath()
    path.moveTo(*points[0])
    for point in points[1:]:
        path.lineTo(*point)
    path.close()
    c.drawPath(path, stroke=1, fill=1)
    c.line(x + 6 * scale, y + 66 * scale, x + 45 * scale, y + 44 * scale)
    c.line(x + 84 * scale, y + 66 * scale, x + 45 * scale, y + 44 * scale)
    c.line(x + 45 * scale, y + 44 * scale, x + 45 * scale, y)
    c.setStrokeColor(GREEN)
    c.setLineWidth(6 * scale)
    c.line(x + 54 * scale, y + 25 * scale, x + 54 * scale, y + 51 * scale)
    c.line(x + 54 * scale, y + 51 * scale, x + 67 * scale, y + 44 * scale)


def clean_icon(c: canvas.Canvas, x: float, y: float, scale: float) -> None:
    c.setFillColor(HexColor("#E52B5B"))
    c.circle(x, y, 45 * scale, stroke=0, fill=1)
    c.setStrokeColor(white)
    c.setLineWidth(6 * scale)
    c.line(x - 24 * scale, y - 18 * scale, x + 24 * scale, y + 28 * scale)
    c.setFillColor(white)
    path = c.beginPath()
    path.moveTo(x - 31 * scale, y - 27 * scale)
    path.lineTo(x - 9 * scale, y - 31 * scale)
    path.lineTo(x - 17 * scale, y - 9 * scale)
    path.close()
    c.drawPath(path, stroke=0, fill=1)


def check_icon(c: canvas.Canvas, x: float, y: float, scale: float) -> None:
    c.setFillColor(GREEN)
    c.circle(x, y, 45 * scale, stroke=0, fill=1)
    c.setStrokeColor(white)
    c.setLineWidth(9 * scale)
    c.setLineCap(1)
    c.line(x - 23 * scale, y, x - 7 * scale, y - 17 * scale)
    c.line(x - 7 * scale, y - 17 * scale, x + 25 * scale, y + 22 * scale)


def panel(
        c: canvas.Canvas,
        column: int,
        row: int,
        heading: str,
        entries: list[Entry] | tuple[list[Entry], list[Entry]],
        *,
        span: int = 1,
        icon: Icon | None = None,
        icon_scale: float = 0.24,
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

    if isinstance(entries, tuple):
        left, right = entries
        draw_lines(c, left, x + 8, body_top, font_size=body_size)
        draw_lines(c, right, x + width / 2 + 4, body_top, font_size=body_size)
    else:
        draw_lines(c, entries, x + 8, body_top, font_size=body_size)

    if icon is not None:
        icon(c, x + width - 34, y + 12, icon_scale)


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


def docker_panel(c: canvas.Canvas) -> None:
    column = 2
    row = 1
    x = column * CELL_WIDTH
    y = PAGE_HEIGHT - (row + 1) * CELL_HEIGHT
    panel(c, column, row, "docker", [], span=4)

    body_top = y + CELL_HEIGHT - 42
    draw_lines(c, [
        "status",
        "start",
        "  all [--train TRAIN_ID|--local] [--pull POLICY] [--timeout SEC]",
        ("  <run_target> [--detach] [--train TRAIN_ID|--local] [--pull POLICY]", ORANGE),
        ("  POLICY=never|missing|always", TEAL),
        "stop all | <run_target>",
        "build all | <run_target> | <image>",
        ("validate", ORANGE),
        "setup one-time-setup | create-network",
        "  create-certificates-volume | copy-certificates",
        ("remove containers | images | network | volumes | all", OUTLINE),
    ], x + 8, body_top, leading=8.1)


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
        "branch", "checkout BRANCH", "clone all / docker", "fetch",
        "list branch / tag", ("next", ORANGE), ("pull", ORANGE),
        "remote", ("status", ORANGE),
    ], body_size=6.7)
    panel(c, 2, 0, "build", [
        ("maven clean all", ORANGE),
        "maven clean cedar",
        ("all [--skip-tests]", ORANGE),
        "<build_target> [--skip-tests]",
        "this [--skip-tests]",
    ], icon=clean_icon, icon_scale=0.18, body_size=6.9)
    panel(c, 3, 0, "publish", [
        ("all", ORANGE), "<build_target>", "this",
        ("train [--resume TRAIN_ID]", ORANGE),
    ], icon=deploy_icon, icon_scale=0.22)
    panel(c, 4, 0, "release", (
        [
            ("plan", ORANGE),
            "  --version VER",
            "  --next-version NEXT",
            "  --from-train TRAIN_ID",
            "  --cee-version CEE",
        ],
        [
            ("start [--unattended]", ORANGE),
            "  --version VER",
            "  --next-version NEXT",
            "  --from-train TRAIN_ID",
            "  --cee-version CEE",
            "resume",
            "status [--json]",
        ],
    ), span=2, body_size=6.7)

    panel(c, 0, 2, "repo", [("config", ORANGE)])
    panel(c, 1, 2, "check", [("repos", ORANGE), ("versions", ORANGE)],
          icon=check_icon, icon_scale=0.24)
    panel(c, 2, 2, "env", [
        ("status", ORANGE), "list [native|docker]",
        "filter TERM", "  [native|docker]",
    ])
    panel(c, 3, 2, "cert", ["ca", "domains", ("setup", ORANGE)],
          icon=check_icon, icon_scale=0.22)
    panel(c, 4, 2, "dev", [
        ("add-hosts", ORANGE), "copy-keycloak-listener", "create-directories",
        "generate-api-key",
    ])
    panel(c, 5, 2, "prod", ["configure-frontends", "reset-frontends"])

    panel(c, 0, 1, "mode", ["native", "hybrid", "docker", "--clear [--force]"])
    panel(c, 1, 1, "native", [
        ("status", ORANGE), ("start all | <run_target>", ORANGE),
        ("stop all | <run_target>", ORANGE), "health", "watch",
        "restart [microservice...]", "logs <microservice>",
    ], icon=terminal_icon, icon_scale=0.20)
    docker_panel(c)

    panel(c, 0, 3, "<build_target>", [
        "java", "project", "parent", "libraries", "clients", "frontends",
    ])
    panel(c, 1, 3, "<run_target>", [
        "infra", "microservices",
        ("microservice all", ORANGE), "microservice <microservice>",
        "frontends", ("frontend all", ORANGE), "frontend <frontend>", "admin",
        "keycloak / kk",
    ])
    panel(c, 2, 3, "<frontend>", [
        "main", "openview", "monitoring", "bridging", "content", "workspace",
        "designer",
    ], icon=browser_icon, icon_scale=0.21)
    panel(c, 3, 3, "<microservice>", (
        ["artifact", "bridge", "group", "impex", "messaging", "monitor", "open"],
        ["repo", "resource", "schema", "submission", "terminology", "user",
         "valuerecommender", "worker"],
    ), span=3)

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
