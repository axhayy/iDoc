import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

function RichTextEditor({ content, onChange, title }) {
  const fileInputRef = useRef(null);
  const editorWrapperRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      TextStyle,
      Color,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "min-h-[650px] outline-none text-lg leading-9 text-slate-700",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const exportPDF = async () => {
    try {
      if (!editor) {
        alert("Editor not ready");
        return;
      }

      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      // Create clean PDF-only container
      const pdfElement = document.createElement("div");

      pdfElement.innerHTML = `
      <div style="
        background: #ffffff;
        color: #111827;
        padding: 40px;
        font-family: Arial, sans-serif;
        line-height: 1.7;
        font-size: 16px;
        width: 100%;
      ">
        <h1 style="
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 24px;
          color: #111827;
        ">
          ${title || "Untitled Document"}
        </h1>

        <div>
          ${editor.getHTML()}
        </div>
      </div>
    `;

      const options = {
        margin: 10,
        filename: `${title || "document"}.pdf`,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      await html2pdf().set(options).from(pdfElement).save();
    } catch (error) {
      console.log("PDF export error:", error);
      alert("PDF export failed. Check console.");
    }
  };
  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();
    const newContent = content || "";

    if (currentHTML !== newContent) {
      editor.commands.setContent(newContent);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter link URL");

    if (!url) return;

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const openImagePicker = () => {
    fileInputRef.current.click();
  };

  const addImage = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const buttonClass =
    "px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-sm font-semibold";

  const activeClass =
    "px-3 py-2 rounded-lg border border-blue-400 bg-blue-100 text-blue-700 text-sm font-semibold";

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={addImage}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="sticky top-0 z-10 mb-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? activeClass : buttonClass}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? activeClass : buttonClass}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? activeClass : buttonClass}
        >
          Underline
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? activeClass : buttonClass}
        >
          Strike
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? activeClass : buttonClass
          }
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? activeClass : buttonClass
          }
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? activeClass : buttonClass}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? activeClass : buttonClass}
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? activeClass : buttonClass}
        >
          Quote
        </button>

        {/* <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? activeClass : buttonClass}
        >
          Code
        </button> */}

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={buttonClass}
        >
          Left
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={buttonClass}
        >
          Center
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={buttonClass}
        >
          Right
        </button>

        <button type="button" onClick={addLink} className={buttonClass}>
          Link
        </button>

        <button type="button" onClick={removeLink} className={buttonClass}>
          Unlink
        </button>
        {/* 
        <button type="button" onClick={openImagePicker} className={buttonClass}>
          Image
        </button> */}

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={buttonClass}
        >
          Undo
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={buttonClass}
        >
          Redo
        </button>

        <button
          type="button"
          onClick={exportPDF}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
        >
          Export to PDF
        </button>
      </div>

      {/* Editable Page */}
      <div
        ref={editorWrapperRef}
        className="rounded-2xl bg-white p-10 shadow-xl border border-slate-200 min-h-[760px]"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default RichTextEditor;
