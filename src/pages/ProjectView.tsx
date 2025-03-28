// pages/CrudView.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

function ProjectView() {
  // For simplicity, we use a local state for the form data.
  const [formData, setFormData] = useState({ id: '', nazwa: '', opis: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you could call an API or update your state management solution.
    console.log('Submitted Data:', formData)
    alert(`Submitted: ${JSON.stringify(formData)}`)
  }

  return (
    <div>
      <h1>{formData.id ? 'Edit Item' : 'Add Item'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            ID:
            <input
              type="number"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Enter ID"
            />
          </label>
        </div>
        <div>
          <label>
            Nazwa:
            <input
              type="text"
              name="nazwa"
              value={formData.nazwa}
              onChange={handleChange}
              placeholder="Enter nazwa"
            />
          </label>
        </div>
        <div>
          <label>
            Opis:
            <input
              type="text"
              name="opis"
              value={formData.opis}
              onChange={handleChange}
              placeholder="Enter opis"
            />
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
      <br />
      <Link to="/">Back to List</Link>
    </div>
  )
}

export default ProjectView
