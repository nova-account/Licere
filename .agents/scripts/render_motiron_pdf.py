from pathlib import Path

import fitz


pdf_path = Path("attached_assets/Residência_FICR____Motiron_2026.2_1789783755556.pdf")
output_dir = Path(".agents/outputs/motiron_pages")
output_dir.mkdir(parents=True, exist_ok=True)

document = fitz.open(pdf_path)
print(f"pages={document.page_count}")
print(f"metadata={document.metadata}")

for index, page in enumerate(document):
    pixmap = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
    output_path = output_dir / f"page-{index + 1}.png"
    pixmap.save(output_path)
    print(output_path)