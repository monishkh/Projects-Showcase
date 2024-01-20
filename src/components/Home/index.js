import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const initialsValue = categoriesList[0].id

const apiConstantStatus = {
  INITIAL: 'initial',
  LOADER: 'loader',
  FAILURE: 'failure',
  SUCCESS: 'success',
}

function Home() {
  const [dropDownValue, setDropDownValue] = useState(initialsValue)
  const [apiStatus, setApiStatus] = useState(apiConstantStatus.INITIAL)
  const [retryBtn, setRetryBtn] = useState(true)
  const [fetchData, setFetchData] = useState([])

  useEffect(() => {
    setApiStatus(apiConstantStatus.LOADER)
    const getData = async () => {
      const response = await fetch(
        `https://apis.ccbp.in/ps/projects?category=${dropDownValue}`,
      )

      const data = await response.json()
      if (response.ok === true) {
        const updateData = data.projects.map(e => ({
          id: e.id,
          imageUrl: e.image_url,
          name: e.name,
        }))

        setFetchData(updateData)
        setApiStatus(apiConstantStatus.SUCCESS)
      } else {
        setApiStatus(apiConstantStatus.FAILURE)
      }
    }

    getData()
  }, [dropDownValue, retryBtn])

  const successView = () => (
    <>
      <div>
        <ul>
          {fetchData?.map(eachItem => (
            <li key={eachItem.id}>
              <div className="item-card">
                <img src={eachItem.imageUrl} alt={eachItem.name} />
                <p className="name">{eachItem.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )

  const failureView = () => (
    <>
      <div className="failure-page">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
          className="f-img"
        />
        <h1 className="f-heading">Oops! Something Went Wrong</h1>
        <p className="f-caption">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          type="button"
          className="f-btn"
          onClick={() => setRetryBtn(prev => !prev)}
        >
          Retry
        </button>
      </div>
    </>
  )

  const loaderView = () => (
    <>
      <div data-testid="loader" className="loader-page">
        <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
      </div>
    </>
  )

  const renderCondition = () => {
    switch (apiStatus) {
      case apiConstantStatus.LOADER:
        return loaderView()
      case apiConstantStatus.SUCCESS:
        return successView()
      case apiConstantStatus.FAILURE:
        return failureView()
      default:
        return null
    }
  }

  return (
    <>
      {/* header container */}
      <div className="header-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
          className="logo-img"
        />
      </div>
      {/* content container */}
      <div className="content-container">
        <select
          value={dropDownValue}
          onChange={e => setDropDownValue(e.target.value)}
        >
          {categoriesList.map(e => (
            <option value={e.id} key={e.id}>
              {e.displayText}
            </option>
          ))}
        </select>

        {/* condition rendering */}
        {renderCondition()}
      </div>
    </>
  )
}

export default Home
