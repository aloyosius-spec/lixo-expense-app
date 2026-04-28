import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const SHARED_FOLDER =
  "https://drive.google.com/drive/folders/1ZTsBS1tOlxAEmQs8_mNEXiYkIMa8mTQA?usp=drive_link";

const OWNER_NAME = "Alo Howard";
const OWNER_PHONE = "773-236-5211";
const COMPANY = "LIXO LLC";
const MARKETING_CAP = 500;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: "",
    month: "April",
    type: "Fuel",
    vendor: "",
    category: "Fuel",
    amount: "",
    gallons: "",
    paymentMethod: "WEX",
    purpose: "",
    receipt: "",
    status: "Pending"
  });

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "type") {
      setForm({
        ...form,
        type: value,
        category: value === "Fuel" ? "Fuel" : "Ads",
        paymentMethod: value === "Fuel" ? "WEX" : "Debit"
      });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  function submitExpense() {
    if (!form.date || !form.vendor || !form.amount) {
      alert("Please enter the date, vendor, and amount before submitting.");
      return;
    }

    setEntries([{ ...form, id: Date.now() }, ...entries]);

    setForm({
      date: "",
      month: form.month,
      type: "Fuel",
      vendor: "",
      category: "Fuel",
      amount: "",
      gallons: "",
      paymentMethod: "WEX",
      purpose: "",
      receipt: "",
      status: "Pending"
    });
  }

  function updateStatus(id, status) {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, status } : entry
      )
    );
  }

  function exportCSV() {
    const headers = [
      "Date",
      "Month",
      "Type",
      "Vendor",
      "Category",
      "Amount",
      "Gallons",
      "Payment Method",
      "Purpose",
      "Receipt Link",
      "Status"
    ];

    const rows = entries.map((e) => [
      e.date,
      e.month,
      e.type,
      e.vendor,
      e.category,
      e.amount,
      e.gallons,
      e.paymentMethod,
      e.purpose,
      e.receipt,
      e.status
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "LIXO_Expense_Report.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  }

  const marketingSpent = entries
    .filter((e) => e.type === "Marketing")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const fuelSpent = entries
    .filter((e) => e.type === "Fuel")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const missingReceipts = entries.filter((e) => !e.receipt).length;
  const remainingMarketing = MARKETING_CAP - marketingSpent;

  const monthlyChartData = useMemo(() => {
    return months.map((month) => {
      const monthEntries = entries.filter((e) => e.month === month);

      return {
        month,
        Fuel: monthEntries
          .filter((e) => e.type === "Fuel")
          .reduce((sum, e) => sum + Number(e.amount || 0), 0),
        Marketing: monthEntries
          .filter((e) => e.type === "Marketing")
          .reduce((sum, e) => sum + Number(e.amount || 0), 0)
      };
    });
  }, [entries]);

  const receiptData = [
    { name: "Complete", value: entries.length - missingReceipts },
    { name: "Missing", value: missingReceipts }
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#eef4f8",
      fontFamily: "Arial, sans-serif",
      padding: "24px",
      color: "#1e293b"
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto"
    },
    header: {
      background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color: "white",
      padding: "28px",
      borderRadius: "18px",
      marginBottom: "20px"
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
      marginBottom: "20px"
    },
    card: {
      background: "white",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      marginBottom: "20px"
    },
    kpi: {
      background: "white",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
    },
    input: {
      width: "100%",
      padding: "11px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      marginBottom: "12px",
      boxSizing: "border-box"
    },
    label: {
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "4px",
      display: "block"
    },
    button: {
      background: "#1d4ed8",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      marginRight: "8px",
      marginBottom: "8px"
    },
    secondaryButton: {
      background: "#0f766e",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      marginRight: "8px",
      marginBottom: "8px"
    },
    dangerText: {
      color: "#dc2626",
      fontWeight: "bold"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      textAlign: "left",
      padding: "10px",
      borderBottom: "2px solid #cbd5e1",
      background: "#f8fafc"
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #e2e8f0"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>{COMPANY} Expense Management App</h1>
          <p>
            Business Development Associate fuel and marketing expense tracking.
          </p>
          <p>
            Owner Contact: <strong>{OWNER_NAME}</strong> | {OWNER_PHONE}
          </p>
          <a
            href={SHARED_FOLDER}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#bfdbfe", fontWeight: "bold" }}
          >
            Open Shared Receipt Folder
          </a>
        </div>

        <div style={styles.cardGrid}>
          <div style={styles.kpi}>
            <h3>Total Fuel Spend</h3>
            <h2>${fuelSpent.toFixed(2)}</h2>
            <p>Fuel policy: one full tank per week</p>
          </div>

          <div style={styles.kpi}>
            <h3>Total Marketing Spend</h3>
            <h2>${marketingSpent.toFixed(2)}</h2>
            <p>
              Remaining Monthly Budget:{" "}
              <strong
                style={{
                  color: remainingMarketing < 0 ? "#dc2626" : "#0f766e"
                }}
              >
                ${remainingMarketing.toFixed(2)}
              </strong>
            </p>
          </div>

          <div style={styles.kpi}>
            <h3>Missing Receipts</h3>
            <h2 style={{ color: missingReceipts > 0 ? "#dc2626" : "#0f766e" }}>
              {missingReceipts}
            </h2>
            <p>Every expense should include a receipt link.</p>
          </div>

          <div style={styles.kpi}>
            <h3>Total Entries</h3>
            <h2>{entries.length}</h2>
            <p>Pending, approved, and rejected expenses.</p>
          </div>
        </div>

        <div style={styles.card}>
          <h2>Submit New Expense</h2>
          <p>
            Use this form to enter fuel or marketing expenses. Upload the
            receipt to Google Drive first, then paste the receipt link below.
          </p>

          <label style={styles.label}>Date Example: 04/24/2026</label>
          <input
            style={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <label style={styles.label}>Month</label>
          <select
            style={styles.input}
            name="month"
            value={form.month}
            onChange={handleChange}
          >
            {months.map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>

          <label style={styles.label}>Expense Type</label>
          <select
            style={styles.input}
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option>Fuel</option>
            <option>Marketing</option>
          </select>

          <label style={styles.label}>Vendor Example: Shell, Meta Ads, Canva</label>
          <input
            style={styles.input}
            name="vendor"
            placeholder="Example: Shell"
            value={form.vendor}
            onChange={handleChange}
          />

          <label style={styles.label}>Category</label>
          <select
            style={styles.input}
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {form.type === "Fuel" ? (
              <option>Fuel</option>
            ) : (
              <>
                <option>Ads</option>
                <option>Events</option>
                <option>Print</option>
                <option>Digital</option>
                <option>Other</option>
              </>
            )}
          </select>

          <label style={styles.label}>Amount Example: 68.12</label>
          <input
            style={styles.input}
            type="number"
            name="amount"
            placeholder="Example: 68.12"
            value={form.amount}
            onChange={handleChange}
          />

          <label style={styles.label}>Gallons Example: 14.5</label>
          <input
            style={styles.input}
            type="number"
            name="gallons"
            placeholder="Fuel only. Example: 14.5"
            value={form.gallons}
            onChange={handleChange}
          />

          <label style={styles.label}>Payment Method</label>
          <select
            style={styles.input}
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option>WEX</option>
            <option>Debit</option>
          </select>

          <label style={styles.label}>
            Purpose Example: Lead generation campaign or weekly fuel fill-up
          </label>
          <input
            style={styles.input}
            name="purpose"
            placeholder="Example: Weekly sales route fuel"
            value={form.purpose}
            onChange={handleChange}
          />

          <label style={styles.label}>Receipt Link</label>
          <input
            style={styles.input}
            name="receipt"
            placeholder="Paste Google Drive receipt file link here"
            value={form.receipt}
            onChange={handleChange}
          />

          <button style={styles.button} onClick={submitExpense}>
            Submit Expense
          </button>

          <button style={styles.secondaryButton} onClick={exportCSV}>
            Export Report for Accounting
          </button>
        </div>

        <div style={styles.card}>
          <h2>Dashboard</h2>

          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Fuel" fill="#1d4ed8" />
                <Bar dataKey="Marketing" fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={receiptData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  <Cell fill="#0f766e" />
                  <Cell fill="#dc2626" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.card}>
          <h2>Expense Review Queue</h2>

          {entries.length === 0 ? (
            <p>No expenses submitted yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Vendor</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Receipt</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td style={styles.td}>{entry.date}</td>
                      <td style={styles.td}>{entry.type}</td>
                      <td style={styles.td}>{entry.vendor}</td>
                      <td style={styles.td}>{entry.category}</td>
                      <td style={styles.td}>
                        ${Number(entry.amount).toFixed(2)}
                      </td>
                      <td style={styles.td}>
                        {entry.receipt ? (
                          <a href={entry.receipt} target="_blank" rel="noreferrer">
                            View Receipt
                          </a>
                        ) : (
                          <span style={styles.dangerText}>Missing Receipt</span>
                        )}
                      </td>
                      <td style={styles.td}>{entry.status}</td>
                      <td style={styles.td}>
                        <button
                          style={styles.secondaryButton}
                          onClick={() => updateStatus(entry.id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          style={styles.button}
                          onClick={() => updateStatus(entry.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <h2>Associate Instructions</h2>
          <ol>
            <li>Take a clear photo of the receipt.</li>
            <li>Upload the receipt to the shared Google Drive folder.</li>
            <li>Copy the individual receipt file link.</li>
            <li>Paste the receipt link into this app.</li>
            <li>Submit the expense for review.</li>
          </ol>

          <p>
            For questions, contact <strong>{OWNER_NAME}</strong> at{" "}
            <strong>{OWNER_PHONE}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}