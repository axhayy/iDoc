import { useEffect, useRef, useState } from "react";
import {
  FiFileText,
  FiPlus,
  FiSave,
  FiTrash2,
  FiLogOut,
  FiSearch,
  FiEdit3,
  FiCloud,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import RichTextEditor from "../components/RichTextEditor";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const saveTimeout = useRef(null);

  const getPreviewText = (html) => {
    if (!html || html === "<p></p>") {
      return "Empty document";
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const text = tempDiv.textContent || tempDiv.innerText || "";

    return text.trim() || "Empty document";
  };
  const exportPDF = async () => {
    try {
      const element = editorWrapperRef.current;

      if (!element) {
        alert("Nothing to export");
        return;
      }

      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const options = {
        margin: 10,
        filename: `${title || "document"}.pdf`,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      html2pdf().set(options).from(element).save();
    } catch (error) {
      console.log("PDF export error:", error);
      alert("PDF export failed. Check console.");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    loadDocuments();
  }, [navigate]);

  useEffect(() => {
    if (!selectedDoc?.id) return;

    clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        await api.put(`/api/documents/${selectedDoc.id}`, selectedDoc);

        setDocuments((prev) =>
          prev.map((doc) => (doc.id === selectedDoc.id ? selectedDoc : doc)),
        );

        console.log("Auto Saved");
      } catch (error) {
        console.log("Auto save error:", error);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout.current);
  }, [selectedDoc]);

  const loadDocuments = async () => {
    try {
      const response = await api.get("/api/documents");
      const data = Array.isArray(response.data) ? response.data : [];

      setDocuments(data);
      console.log("Loaded documents:", data);
    } catch (error) {
      console.log("Load error:", error);
    }
  };

  const createDocument = async () => {
    try {
      const response = await api.post("/api/documents", {
        title: "Untitled Document",
        content: "",
      });

      setDocuments((prev) => [...prev, response.data]);
      setSelectedDoc(response.data);
    } catch (error) {
      console.log("Create error:", error);
    }
  };

  const saveDocument = async () => {
    try {
      if (!selectedDoc) {
        alert("Select a document first");
        return;
      }

      const response = await api.put(
        `/api/documents/${selectedDoc.id}`,
        selectedDoc,
      );

      setDocuments((prev) =>
        prev.map((doc) => (doc.id === selectedDoc.id ? response.data : doc)),
      );

      setSelectedDoc(response.data);
      alert("Document Saved");
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  const deleteDocument = async () => {
    try {
      if (!selectedDoc) {
        alert("Select a document first");
        return;
      }

      await api.delete(`/api/documents/${selectedDoc.id}`);

      setDocuments((prev) => prev.filter((doc) => doc.id !== selectedDoc.id));

      setSelectedDoc(null);
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredDocuments = documents.filter((doc) =>
    (doc.title || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen w-full bg-slate-100 text-slate-900 flex overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-[330px] h-screen bg-white border-r border-slate-200 flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg">
              <FiFileText />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">iDocs</h1>
              <p className="text-[10px] tracking-[3px] font-bold text-slate-400">
                DOCUMENT EDITOR
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-b border-slate-100">
          <button
            type="button"
            onClick={createDocument}
            className="w-full h-12 rounded-2xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md"
          >
            <FiPlus />
            New Document
          </button>

          <div className="relative mt-4">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl bg-slate-100 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">{documents.length} documents</span>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>

        {/* Blank Document */}
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Start New
          </p>

          <button
            type="button"
            onClick={createDocument}
            className="w-full h-36 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/60 hover:bg-blue-100 transition flex flex-col items-center justify-center"
          >
            <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">
              <FiPlus />
            </div>

            <p className="mt-3 font-semibold text-blue-700">Blank Document</p>
          </button>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Recent Documents
          </p>

          {filteredDocuments.length === 0 ? (
            <div className="mt-10 text-center text-slate-400 text-sm">
              No documents found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc, index) => (
                <button
                  type="button"
                  key={`doc-${doc.id ?? "no-id"}-${index}`}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left rounded-2xl border transition overflow-hidden bg-white hover:shadow-md ${
                    selectedDoc?.id === doc.id
                      ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="h-20 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                    <FiFileText className="text-3xl text-blue-500" />
                  </div>

                  <div className="p-3">
                    <h3 className="font-bold text-sm truncate">
                      {doc.title || "Untitled Document"}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {getPreviewText(doc.content).substring(0, 80)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT EDITOR AREA */}
      <main className="flex-1 h-screen flex flex-col overflow-hidden mt-4">
        {/* Top Editor Bar */}
        <header className="h-17 border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <FiCloud className="text-blue-600 text-xl" />

            <div>
              <p className="text-sm font-semibold">
                {selectedDoc ? "Editing Document" : "Workspace"}
              </p>
              <p className="text-xs text-slate-400">Autosave enabled</p>
            </div> */}
          </div>

          {selectedDoc && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={saveDocument}
                className="h-10 px-5 rounded-xl bg-emerald-600 text-white font-semibold flex items-center gap-2 hover:bg-emerald-700 transition"
              >
                <FiSave />
                Save
              </button>

              <button
                type="button"
                onClick={deleteDocument}
                className="h-10 px-5 rounded-xl bg-red-500 text-white font-semibold flex items-center gap-2 hover:bg-red-600 transition"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          )}
        </header>

        {/* Editor Content */}
        <section className="flex-1 overflow-y-auto bg-slate-100">
          {selectedDoc ? (
            <div className="min-h-full flex justify-center px-8 py-10">
              <div className="w-full max-w-4xl bg-white min-h-[850px] rounded-2xl shadow-xl border border-slate-200 px-14 py-12">
                <input
                  type="text"
                  value={selectedDoc.title || ""}
                  onChange={(e) =>
                    setSelectedDoc({
                      ...selectedDoc,
                      title: e.target.value,
                    })
                  }
                  placeholder="Untitled Document"
                  className="w-full text-5xl font-bold outline-none border-none bg-transparent placeholder:text-slate-300 mb-8"
                />

                <RichTextEditor
                  title={selectedDoc.title}
                  content={selectedDoc.content || ""}
                  onChange={(html) =>
                    setSelectedDoc({
                      ...selectedDoc,
                      content: html,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center px-8">
              <div className="text-center max-w-xl">
                {/* <div className="mx-auto h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-5xl shadow-xl mb-6">
                  <FiEdit3 />
                </div> */}
                <div className="mx-auto h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-5xl shadow-xl mb-6">
                  <FiFileText />
                </div>

                <h2 className="text-6xl font-extrabold tracking-tight text-slate-900">
                  Welcome to iDocs
                </h2>

                <p className="mt-4 text-slate-500 text-lg">
                  Create a new document or select one from your recent
                  documents.
                </p>

                <button
                  type="button"
                  onClick={createDocument}
                  className="mt-8 h-12 px-7 rounded-2xl bg-blue-600 text-white font-semibold inline-flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
                >
                  <FiPlus />
                  Create Document
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
