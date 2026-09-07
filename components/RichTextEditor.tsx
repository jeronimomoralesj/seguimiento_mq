"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function RichTextEditor({ value, onChange, placeholder, rows = 5 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? "Escribe aquí..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "outline-none text-sm text-zinc-800 leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  const minH = `${rows * 1.625}rem`;

  return (
    <div className="border border-zinc-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#F5A623] focus-within:border-transparent transition overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-zinc-100 bg-zinc-50">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrita">
          <Bold size={13} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Cursiva">
          <Italic size={13} />
        </ToolBtn>
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista">
          <List size={13} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
          <ListOrdered size={13} />
        </ToolBtn>
      </div>
      <EditorContent
        editor={editor}
        className="rich-editor px-4 py-3"
        style={{ minHeight: minH }}
      />
    </div>
  );
}

function ToolBtn({ onClick, active, title, children }: {
  onClick: () => void; active: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${active ? "bg-[#F5A623] text-white" : "text-zinc-500 hover:bg-zinc-100"}`}
    >
      {children}
    </button>
  );
}
