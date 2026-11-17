"""Tests for unwrap_prose.py, built from real pages in this repo.

Run with: python3 scripts/test_unwrap_prose.py
"""

import re
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from unwrap_prose import unwrap  # noqa: E402


def same_text(a, b):
    """Unwrapping may only move line breaks (and drop `>` on joined quote lines)."""

    def norm(t):
        return re.sub(r"\s+", " ", re.sub(r"(?m)^\s*>+ ?", "", t))

    return norm(a) == norm(b)


class UnwrapTest(unittest.TestCase):
    def check(self, before, after):
        got = unwrap(before)
        self.assertEqual(got, after)
        self.assertTrue(same_text(before, got))
        self.assertEqual(unwrap(got), got, "second run must change nothing")

    def test_paragraph_joined(self):
        self.check(
            "Welcome to the homepage! Here\nyou'll find all the\n[artifacts](#links).\n",
            "Welcome to the homepage! Here you'll find all the [artifacts](#links).\n",
        )

    def test_frontmatter_untouched(self):
        text = "---\ntitle: A title\nauthors:\n  - Vladimir Filkov\ntags: [a, b]\n---\n\nBody.\n"
        self.check(text, text)

    def test_grid_with_image_options(self):
        # index.md: option lines stay put, the grid item's prose is joined.
        before = (
            "::::::{grid} 1 2 2 2\n\n::::{grid-item}\n:::{image} static/images/uc-ospo-logo.png\n"
            ":alt: UC OSPO Logo\n:width: 180\n:::\n::::\n\n::::{grid-item}\n"
            "The UC OSPO Network is a groundbreaking initiative.\n"
            "This collaborative effort aims to amplify impact.\n::::\n::::::\n"
        )
        after = before.replace(
            "initiative.\nThis collaborative", "initiative. This collaborative"
        )
        self.check(before, after)

    def test_note_options_not_merged_into_body(self):
        self.check(
            ":::{note}\n:class: dropdown\n:open:\nNote body\nwrapped here.\n:::\n",
            ":::{note}\n:class: dropdown\n:open:\nNote body wrapped here.\n:::\n",
        )

    def test_list_table_untouched(self):
        # about/services.md: a backtick directive is a fence, left as is.
        text = (
            "```{list-table}\n:header-rows: 1\n\n* - Service\n  - Primary Contact(s)\n"
            "* - [Licensing](#licensing)\n  - [Karla Padilla](mailto:kapadilla@ucsd.edu) (UCSD)\n```\n"
        )
        self.check(text, text)

    def test_nested_list_indented_four_spaces(self):
        # CONTRIBUTING.md nests its steps under a "1.  " item.
        before = (
            "1.  If you are a first-time contributor:\n"
            "    - Go to <https://github.com/UC-OSPO-Network/ucospo.net/> and click the\n"
            '      "fork" button to create your own copy of the project.\n\n'
            "    - Clone the project to your local computer:\n\n"
            "      ```bash\n      git clone https://github.com/your-username/ucospo.net.git\n      ```\n"
        )
        after = before.replace('click the\n      "fork"', 'click the "fork"')
        self.check(before, after)

    def test_nested_fence_kept_whole(self):
        # events/uc-open-2026/index.md nests ```{image} inside ````{list-table}.
        # The inner ``` must not close the outer fence, so a code block inside
        # stays verbatim and prose after the outer fence still joins.
        before = (
            "````{tab-set}\n```python\nx = 1\ny = 2\n```\nline a\nline b\n````\n"
            "After the\nfence.\n"
        )
        after = before.replace("After the\nfence.", "After the fence.")
        self.check(before, after)

    def test_fence_with_info_string_does_not_close(self):
        text = "```\n```bash\necho hi\n```\n"
        self.check(text, text)

    def test_indented_code_outside_a_list_untouched(self):
        text = "Run this:\n\n    make html\n    make serve\n"
        self.check(text, text)

    def test_ucsb_button_div(self):
        # PR #368's lounge page: the option line and the HTML stay as they are.
        text = (
            "::::{div}\n:class: btn-center-wrapper\n\n"
            '<a href="https://docs.google.com/forms/x" class="btn-ucsb-primary">Register\n'
            "for the 10/8 evening edition</a>\n::::\n"
        )
        self.check(text, text)

    def test_myst_comment_does_not_swallow_prose(self):
        # about/services.md. Joining a comment to the next line would hide it.
        text = "% ## Service Candidates\n%\n% Standardized frameworks for assessing\nrisk.\n"
        self.check(text, text)

    def test_target_label_stays_on_its_own_line(self):
        text = "(links-to-research-products)=\n## Links to research products\n"
        self.check(text, text)

    def test_hard_breaks_kept(self):
        self.check("Line one\\\nline two\n", "Line one\\\nline two\n")
        self.check("Line one  \nline two\n", "Line one  \nline two\n")

    def test_list_item_continuation(self):
        self.check(
            "- **Paper:**\n  [doi:10.1371/x](https://doi.org/10.1371/x)\n- **Preprint:**\n  [doi:y](https://doi.org/y)\n",
            "- **Paper:** [doi:10.1371/x](https://doi.org/10.1371/x)\n- **Preprint:** [doi:y](https://doi.org/y)\n",
        )

    def test_blockquote_joined(self):
        self.check(
            "> **_NOTE:_** Advanced Git users may want to rebase, but we squash\n> and merge PRs either way.\n",
            "> **_NOTE:_** Advanced Git users may want to rebase, but we squash and merge PRs either way.\n",
        )

    def test_table_and_heading_untouched(self):
        text = "## Heading\n\n| a | b |\n| - | - |\n| 1 | 2 |\n"
        self.check(text, text)


if __name__ == "__main__":
    unittest.main()
