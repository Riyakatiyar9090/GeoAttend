import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiUpload, FiDownload } from "react-icons/fi";
import StudentStats from "../../components/StudentStats/StudentStats";
import StudentFilters from "../../components/StudentFilters/StudentFilters";
import StudentTable from "../../components/StudentTable/StudentTable";
import StudentSidebar from "../../components/StudentSidebar/StudentSidebar";
import StudentDistribution from "../../components/StudentDistribution/StudentDistribution";
import StudentProfileModal from "../../components/StudentProfileModal/StudentProfileModal";
import DeleteStudentModal from "../../components/DeleteStudentModal/DeleteStudentModal";
import Pagination from "../../components/Pagination/Pagination";
import EmptyState from "../../components/EmptyState/EmptyState";
import { STUDENTS } from "./studentData";
import "./ManageStudents.css";

const PAGE_SIZE = 12;
const DEFAULT_FILTERS = {
  search: "",
  dept: "All",
  semester: "All",
  section: "All",
  status: "All",
  sort: "name-asc",
};

export default function ManageStudents() {
  const [students, setStudents] = useState(STUDENTS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewStudent, setViewStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    let data = [...students];
    const q = filters.search.toLowerCase();
    if (q)
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.roll.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.regNo.toLowerCase().includes(q),
      );
    if (filters.dept !== "All")
      data = data.filter((s) => s.department === filters.dept);
    if (filters.semester !== "All")
      data = data.filter((s) => s.semester === filters.semester);
    if (filters.section !== "All")
      data = data.filter((s) => s.section === filters.section);
    if (filters.status !== "All")
      data = data.filter((s) => s.status === filters.status);

    if (filters.sort === "name-asc")
      data.sort((a, b) => a.name.localeCompare(b.name));
    else if (filters.sort === "name-desc")
      data.sort((a, b) => b.name.localeCompare(a.name));
    else if (filters.sort === "attendance-high")
      data.sort((a, b) => b.attendance - a.attendance);
    else if (filters.sort === "attendance-low")
      data.sort((a, b) => a.attendance - b.attendance);

    return data;
  }, [students, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStudents = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = (students) => {
    const ids = students.map((s) => s.id);
    setSelectedIds((prev) =>
      ids.every((id) => prev.has(id)) ? new Set() : new Set(ids),
    );
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    await new Promise((res) => setTimeout(res, 800));
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setDeleteStudent(null);
    setDeleting(false);
  };

  const handleFilterChange = (f) => {
    setFilters(f);
    setPage(1);
  };
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <div className="manage-students-page">
      {/* Header */}
      <motion.div
        className="ms-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Manage Students</h1>
          <p>
            View, organize and manage all students registered in the system.
          </p>
        </div>
        <div className="ms-header-actions">
          <button className="ms-btn-outline">
            <FiUpload /> Import CSV
          </button>
          <button className="ms-btn-outline">
            <FiDownload /> Export
          </button>
          <motion.button
            className="ms-btn-primary"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => alert("Add student — backend pending")}
          >
            <FiUserPlus /> Add Student
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <StudentStats students={students} />

      {/* Filters */}
      <StudentFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Summary bar */}
      <div className="ms-summary-bar">
        <span>
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{students.length}</strong> students
        </span>
        <div className="ms-chip-row">
          {["Active", "Inactive", "Blocked"].map((s) => (
            <span key={s} className={`ms-chip ms-chip-${s.toLowerCase()}`}>
              {s}: {filtered.filter((st) => st.status === s).length}
            </span>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="ms-main-layout">
        <div className="ms-table-col">
          {filtered.length === 0 ? (
            <EmptyState
              title="No Students Found"
              subtitle="Try adjusting your filters or reset to see all students."
              onRefresh={handleReset}
            />
          ) : (
            <StudentTable
              students={pageStudents}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
              onView={setViewStudent}
              onDelete={setDeleteStudent}
            />
          )}
          {filtered.length > PAGE_SIZE && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPage={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>
        <div className="ms-sidebar-col">
          <StudentSidebar />
        </div>
      </div>

      {/* Distribution */}
      <div className="ms-section-title">
        <h2>Student Distribution</h2>
      </div>
      <StudentDistribution />

      {/* Modals */}
      <StudentProfileModal
        student={viewStudent}
        onClose={() => setViewStudent(null)}
      />
      <DeleteStudentModal
        student={deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
