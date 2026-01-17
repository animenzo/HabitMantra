import FolderList from "./sidebar/FolderList";

export default function Sidebar() {
  return (
    <div className="w-full md:w-64 border-r bg-white p-3 shrink-0">
      <h2 className="font-semibold mb-3">Notes</h2>
      <FolderList />
    </div>
  );
}
