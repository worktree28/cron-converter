import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December']
  const cron_weeks = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const cron_months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  const [repeats, setRepeats] = useState('never')
  const [start_cron0, setStartCron] = useState('')
  const [end_cron0, setEndCron] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    const { 'start-date': startDate, 'end-date': endDate, 'start-time': startTime, 'end-time': endTime, repeats } = data
    let start_cron = ''
    let end_cron = ''
    let local_start = new Date(startDate + 'T' + startTime + ":00" + 'Z')
    let local_end = new Date(startDate + 'T' + endTime + ":00" + 'Z')
    let utc_start = new Date(local_start.getTime() + local_start.getTimezoneOffset() * 60000)
    let utc_end = new Date(local_end.getTime() + local_end.getTimezoneOffset() * 60000)
    let next_day = false
    if (utc_start > utc_end) {
      utc_end.setDate(utc_end.getDate() + 1)
      next_day = true
    }
    if (repeats === 'never') {
      start_cron = `${utc_start.getMinutes()} ${utc_start.getHours()} ${utc_start.getDate()} ${utc_start.getMonth() + 1} *`
      end_cron = `${utc_end.getMinutes()} ${utc_end.getHours()} ${utc_end.getDate()} ${utc_end.getMonth() + 1} *`
    }
    if (repeats === 'daily') {
      start_cron = `${utc_start.getMinutes()} ${utc_start.getHours()} * * *`
      end_cron = `${utc_end.getMinutes()} ${utc_end.getHours()} * * *`
    }
    if (repeats === 'weekly') {
      let days = cron_weeks.map((day, index) => {
        if (data[weeks[index]]) {
          return day
        }
      })
      days = days.filter((day) => day === undefined ? false : true)
      start_cron = `${utc_start.getMinutes()} ${utc_start.getHours()} * * ${days.join(',')}`
      if (next_day) {
        days = days.map((day) => {
          if (day === 'sun') {
            return 'mon'
          }
          return cron_weeks[cron_weeks.indexOf(day) + 1]
        })
        end_cron = `${utc_end.getMinutes()} ${utc_end.getHours()} * * ${days.join(',')}`
      } else {
        end_cron = `${utc_end.getMinutes()} ${utc_end.getHours()} * * ${days.join(',')}`
      }
    }
    if (repeats === 'monthly') {
      let months2 = cron_months.map((month, index) => {
        if (data[months[index]]) {
          return month
        }
      })
      months2 = months2.filter((month) => month === undefined ? false : true)
      start_cron = `${utc_start.getMinutes()} ${utc_start.getHours()} ${utc_start.getDate()} ${months2.join(',')} *`
      if (next_day && utc_end.getDate() === 1) {
        months2 = months2.map((month) => {
          if (month === 'dec') {
            return 'jan'
          }
          return cron_months[cron_months.indexOf(month) + 1]
        })
        end_cron = `${utc_end.getMinutes()} ${utc_end.getHours()} ${utc_end.getDate()} ${months2.join(',')} *`
      } else {
        end_cron = `${utc_end.getMinutes()} ${utc_end.getHours()} ${utc_end.getDate()} ${months2.join(',')} *`
      }
    }
    console.log(start_cron)
    console.log(end_cron)
    setStartCron(start_cron)
    setEndCron(end_cron)
    console.log({ utc_start, utc_end })
  }
  return (
    <>
      <form onSubmit={submit}>
        <div>
          <label for='start-date'>Start Date</label>
          <input
            id='start-date'
            type='date'
            name='start-date'
            required={true}
          />
        </div>
        <div>
          <label for='end-date'>End Date</label>
          <input
            id='end-date'
            type='date'
            name='end-on'
          />
        </div>
        <div>
          <label for='start-time'>Start Time</label>
          <input
            id='start-time'
            type='time'
            name='start-time'
            required={true}
          />
        </div>
        <div>
          <label for='end-time'>End Time</label>
          <input
            id='end-time'
            type='time'
            name='end-time'
            required={true}
          />
        </div>
        {repeats === 'weekly' && <div>Weeks</div>}
        {repeats === 'monthly' && <div>Months</div>}
        {repeats === 'weekly' &&
          weeks.map((day) => (
            <div key={day} style={{ textAlign: "left" }}>
              <input
                id={day}
                type='checkbox'
                name={day}
              />
              <label for={day}>{day}</label>
            </div>
          ))
        }
        {
          repeats === 'monthly' &&
          months.map((month) => (
            <div key={month} style={{ textAlign: "left" }}>
              <input
                id={month}
                type='checkbox'
                name={month}
              />
              <label for={month}>{month}</label>
            </div>
          ))
        }
        <label for='repeats'>Repeats</label>
        <select id='repeats' name='repeats' onChange={(e) => setRepeats(e.target.value)}>
          <option value='never'>Never</option>
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
        </select>
        <div>
          <button type='submit'>Submit</button>
        </div>
      </form>
      <div>
        <h2>Start Cron</h2>
        <p>{start_cron0}</p>
      </div>
      <div>
        <h2>End Cron</h2>
        <p>{end_cron0}</p>
      </div>
    </>

  )
}

export default App
