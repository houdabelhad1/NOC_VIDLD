import React, { useState } from "react"

function CareReports() {
  const [reports, setReports] = useState([
    { id: 1, patientName: "John Doe", date: "2023-05-30", status: "Completed" },
    { id: 2, patientName: "Jane Smith", date: "2023-05-29", status: "Pending" },
  ])

  const [newReport, setNewReport] = useState({
    patientName: "",
    date: "",
    report: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewReport({ ...newReport, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const report = {
      id: reports.length + 1,
      ...newReport,
      status: "Completed",
    }
    setReports([report, ...reports])
    setNewReport({ patientName: "", date: "", report: "" })
  }

  return (
    <div className="care-reports-container">
      <h2>Care Reports</h2>
      <div className="report-layout">
        <form onSubmit={handleSubmit} className="full-width-form mb-5">
          <div className="mb-4">
            <label htmlFor="patientName" className="form-label fs-5">
              Patient Name
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="patientName"
              name="patientName"
              value={newReport.patientName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="form-label fs-5">
              Date
            </label>
            <input
              type="date"
              className="form-control form-control-lg"
              id="date"
              name="date"
              value={newReport.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="report" className="form-label fs-5">
              Report
            </label>
            <textarea
              className="form-control form-control-lg"
              id="report"
              name="report"
              rows="5"
              value={newReport.report}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100">
            Submit Report
          </button>
        </form>

        <div className="recent-reports full-width">
          <h3 className="mb-4">Recent Reports</h3>
          <div className="list-group">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="list-group-item d-flex justify-content-between align-items-center py-3"
              >
                <div>
                  <strong className="me-2">{report.patientName}</strong>
                  <span className="text-muted me-3">{report.date}</span>
                </div>
                <span className={`badge ${report.status === 'Completed' ? 'bg-success' : 'bg-warning'} fs-6`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareReports