import fitz


def extract_text_from_pdf(pdf_file):

    text = ""

    try:
        pdf_file.seek(0)

        document = fitz.open(stream=pdf_file.read(), filetype="pdf")

        for page in document:
            text += page.get_text()

        document.close()

        pdf_file.seek(0)

        print("EXTRACTED TEXT LENGTH:", len(text))
        print("EXTRACTED TEXT:", text[:500])

        return text.strip()

    except Exception as e:
        print("PDF extraction error:", e)

        return ""