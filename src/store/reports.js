import axios from 'axios'

export default {
  namespaced: true,

  state: {
    reportFundingTrend: [],
  },
  getters: {
       
    category: (state) => (id) => {
      return state.organisationCategories.find(item => item.id === id)
    }
  },
  mutations: {
    SET_FUNDING_TREND (state, payload) {
      state.reportFundingTrend = payload
    }
  },
  actions: {    
    getFundingTrendReport(_, payload) {
     return axios.post(`/reports/funding-trend`, payload);
    },

    getFundingBySectorReport(_, payload) {
      return axios.post(`/reports/funding-by-sector`, payload);
    },

    getFundingBySourceReport(_, payload) {
    return axios.post(`/reports/funding-by-source`, payload);
    },

    getTotalProjectsTrendReport(_, payload) {
      return axios.post(`/reports/total-projects-trend`, payload);
     },
    
     getFundingTotal(_, year = 1) {
        const payload = (year == 1) ? {} : {year: year}
      return axios.post(`/reports/funding-total`, payload);
     },

  }
}