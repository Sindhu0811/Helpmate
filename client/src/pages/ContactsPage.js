import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { addAlert } from "../utils/recentAlerts";
import "../styles/contact.css";

const ContactsPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userEmail = user.email;

  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relation: "",
    email: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    name: "",
  });

  // ---------- Fetch Contacts ----------
  const fetchContacts = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(
        "https://helpmate-production.up.railway.app/api/emergency-contacts",
        { params: { email: userEmail } }
      );
      setContacts(res.data || []);
    } catch {
      toast.error("⚠️ Failed to fetch contacts");
    }
  }, [userEmail]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // ---------- Validation ----------
  const isValidPhone = (phone) => /^\d{7,15}$/.test(phone);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ---------- Add / Update Contact ----------
 const handleSubmit = async () => {
  if (!formData.name || !formData.phone || !formData.email) {
    toast.warn("⚠️ Name, Phone, and Email are required");
    return;
  }

  if (!isValidPhone(formData.phone)) {
    toast.warn("⚠️ Phone must contain 10 digits");
    return;
  }

  if (!isValidEmail(formData.email)) {
    toast.warn("⚠️ Enter a valid email");
    return;
  }

  try {
    if (editingId) {
      // ✅ UPDATE CONTACT
      await axios.put(
        `https://helpmate-production.up.railway.app/api/emergency-contacts/${editingId}`,
        {
          userEmail, // send userEmail if backend checks ownership
          name: formData.name,
          phone: formData.phone,
          relation: formData.relation,
          contactEmail: formData.email,
        }
      );

      toast.success("✅ Contact updated successfully!");
      addAlert(`Updated ${formData.name}`);

    } else {
      // ✅ ADD CONTACT
      await axios.post(
        "https://helpmate-production.up.railway.app/api/emergency-contacts",
        {
          userEmail, // ✅ IMPORTANT FIX
          name: formData.name,
          phone: formData.phone,
          relation: formData.relation,
          contactEmail: formData.email,
        }
      );

      toast.success("🎉 Contact added successfully!");
      addAlert(`Added ${formData.name}`);
    }

    // Reset form
    setFormData({ name: "", phone: "", relation: "", email: "" });
    setEditingId(null);
    setShowForm(false);
    fetchContacts();

  } catch (error) {
    console.error("Save error:", error.response?.data || error.message);
    toast.error("⚠️ Failed to save contact");
  }
};


  const handleEdit = (c) => {
    setFormData({
      name: c.name,
      phone: c.phone,
      relation: c.relation || "",
      email: c.contactEmail || c.contactemail || "",
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const openDeleteModal = (id, name) =>
    setDeleteModal({ show: true, id, name });

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://helpmate-production.up.railway.app/api/emergency-contacts/${deleteModal.id}`
      );
      setContacts((prev) => prev.filter((c) => c.id !== deleteModal.id));
      toast.success("🗑 Contact deleted successfully!");
      addAlert(`Deleted ${deleteModal.name}`);
      setDeleteModal({ show: false, id: null, name: "" });
    } catch {
      toast.error("⚠️ Failed to delete contact");
    }
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase();

  return (
    <div className="contact-page">
      <div className="contact-card">
        <div className="contact-header">
          <h2>Emergency Contacts</h2>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Contact
          </button>
        </div>

        {showForm && (
          <div className="contact-form">
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })
              }
            />
            <input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              placeholder="Relation (optional)"
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
            />

            <div className="form-actions">
              <button onClick={handleSubmit}>
                {editingId ? "Update" : "Save"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", phone: "", relation: "", email: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="contact-list">
          {contacts.length === 0 ? (
            <p className="empty-text">No emergency contacts added.</p>
          ) : (
            contacts.map((c) => (
              <div className="contact-item" key={c.id}>
                <div className="contact-left">
                  <div className="avatar">{getInitial(c.name)}</div>
                  <div>
                    <p className="contact-name">
                      {c.relation ? `${c.name} (${c.relation})` : c.name}
                    </p>
                    <p className="contact-email">{c.contactEmail || c.contactemail}</p>
                  </div>
                </div>

                <div className="contact-actions">
                  <button
                    className="call-btn"
                    onClick={() => {
                      window.location.href = `tel:${c.phone}`;
                      addAlert(`Called ${c.name}`);
                    }}
                  >
                    📞
                  </button>
                  <button className="edit-btn" onClick={() => handleEdit(c)}>✏️</button>
                  <button className="delete-btn" onClick={() => openDeleteModal(c.id, c.name)}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        {deleteModal.show && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <h3>Delete Contact</h3>
              <p>You're going to delete <strong>{deleteModal.name}</strong></p>
              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setDeleteModal({ show: false, id: null, name: "" })}
                >
                  No
                </button>
                <button className="delete-btn" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;