import React, { Component } from "react";
import { Card, CardBody, CardTitle, CardImg } from 'reactstrap';
import "isomorphic-fetch";
import "./LaunchPrograms.css";
import axios from "axios"

class LaunchPrograms extends Component {
  constructor(props) {
    super(props);

    let initialData;
    if (__isBrowser__) {
      initialData = window.__initialData__;
      delete window.__initialData__;
    } else {
      initialData = props.staticContext.initialData;
    }
    this.state = {
      launchData: initialData,
      yearsFilterOptions: ['2006', '2007', '2008', '2009', '2010',
        '2011', '2012', '2013', '2014', '2015', '2016',
        '2017', '2018', '2019', '2020'],
      selectedYearOption: "",
      selectedLaunchSuccessFilter: { value: false, isSelected: false },
      selectedLandingSuccessFilter: { value: false, isSelected: false }
    };
  }

  componentDidMount() {
    if (!this.state.launchData) {
      launchData.requestInitialData().then(data => this.setState({ launchData: data }));
    }
  }

  static requestInitialData() {
    return fetch("https://api.spaceXdata.com/v3/launches?limit=100")
      .then(response => response.json())
      .catch(error => console.log(error));
  }






  serialize = obj => Object.keys(obj).map(key => `${key}=${encodeURIComponent(obj[key])}`).join('&')

  changeUrl = () => {

    var params = {}
    if (this.state.selectedLaunchSuccessFilter.isSelected) {
      params.launch_success = this.state.selectedLaunchSuccessFilter.value
    }

    if (this.state.selectedLandingSuccessFilter.isSelected) {
      params.land_success = this.state.selectedLandingSuccessFilter.value

    }

    if (this.state.selectedYearOption.length > 0) {
      params.launch_year = this.state.selectedYearOption

    }


    this.props.history.push({
      pathname: `${this.props.match.url}filter`,
      search: this.serialize(params)
    })
    axios.get('https://api.spaceXdata.com/v3/launches?limit=100', { params: params }).then((response) => {
      this.setState({ launchData: response.data })

    }).catch((error) => {
      console.log(error);
    })


  }

  handleClickOnYear = (label) => {
    this.setState({ selectedYearOption: label }, () => { this.changeUrl() })
  }


  handleClickOnLaunchSuccessFilter = (value) => {

    var selectedLaunchSuccessFilter = Object.assign({}, this.state.selectedLaunchSuccessFilter)
    selectedLaunchSuccessFilter.value = value
    selectedLaunchSuccessFilter.isSelected = true
    this.setState({ selectedLaunchSuccessFilter }, () => { this.changeUrl() })
  }


  handleClickOnLandingSuccessFilter = (value) => {
    var selectedLandingSuccessFilter = Object.assign({}, this.state.selectedLandingSuccessFilter)
    selectedLandingSuccessFilter.value = value
    selectedLandingSuccessFilter.isSelected = true
    this.setState({ selectedLandingSuccessFilter }, () => { this.changeUrl() })
  }




  render() {

    const { launchData } = this.state;
    return (
      <React.Fragment>
      <main>
      <h2>SpaceX Launch Programs</h2>
      <section className="container">
        <section className="filter-section">
          <Card>
            <CardTitle>Filters</CardTitle>

            <CardBody>
              <div className="filter_title">Launch Year</div>
              <div className="year_list">
                {this.state.yearsFilterOptions.map((item, index) => {
                  return (
                    <div className="filter_option">
                      <div onClick={() => { this.handleClickOnYear(item) }} className={(this.state.selectedYearOption==item)?"filter_option_button selected":"filter_option_button"}>{item}</div>
                    </div>
                  )
                })}
              </div>
              <div className="filter_title">Successful Launch</div>
              <div className="year_list">
                <div className="filter_option">
                  <div onClick={() => { this.handleClickOnLaunchSuccessFilter(true) }} className={(this.state.selectedLaunchSuccessFilter.value && this.state.selectedLaunchSuccessFilter.isSelected)?"filter_option_button selected":"filter_option_button"}>True</div>
                </div>
                <div onClick={() => { this.handleClickOnLaunchSuccessFilter(false) }} className="filter_option">
                  <div onClick={() => { this.handleClickOnLaunchSuccessFilter(true) }} className={(!this.state.selectedLaunchSuccessFilter.value && this.state.selectedLaunchSuccessFilter.isSelected)?"filter_option_button selected":"filter_option_button"}>False</div>
                </div>
              </div>

              <div className="filter_title">Successful Landing</div>
              <div className="year_list">
                <div className="filter_option">
                  <div onClick={() => { this.handleClickOnLandingSuccessFilter(true) }} className={(this.state.selectedLandingSuccessFilter.value && this.state.selectedLandingSuccessFilter.isSelected)?"filter_option_button selected":"filter_option_button"}>True</div>
                </div>
                <div className="filter_option">
                  <div onClick={() => { this.handleClickOnLandingSuccessFilter(false) }} className={(!this.state.selectedLandingSuccessFilter.value && this.state.selectedLandingSuccessFilter.isSelected)?"filter_option_button selected":"filter_option_button"}>False</div>
                </div>
              </div>

            </CardBody>
          </Card>
        </section>
        <section className="card-section">
          {launchData.map((item) => {
            return (
              <Card key={item.flight_number}>
                <CardImg top src={item.links.mission_patch_small} alt="Card image cap" />
                <CardBody>
                  <CardTitle className="card_values">{item.mission_name + " #" + item.flight_number}</CardTitle>
                  <div className="card_text">
                    <div className="bold_text">Mission Ids:</div>
                    <ul>
                      {item.mission_id.map((item, index) => {
                        return <li key={index}>{item}</li>
                      })}
                    </ul>
                  </div>
                  <div className="card_text">
                    <span className="bold_text">Launch Year:</span>
                    <span  className="card_values">{item.launch_year}</span>
                  </div>
                  <div className="card_text">
                    <span className="bold_text">Successful Launch:</span>
                    <span  className="card_values">{item.launch_success ? "true" : "false"}</span>
                  </div>
                  <div className="card_text">
                    <span className="bold_text">Successful Landing:</span>
                    <span  className="card_values">{item.launch_landing ? "true" : "false"}</span>
                  </div>

                </CardBody>
              </Card>
            )
          })}
        </section>
        </section>
      </main>
      </React.Fragment>
    );
  }
}

export default LaunchPrograms;
