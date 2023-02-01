<template>
  <main class="page project-page" style="min-height: 80vh;">    
    <div class="container">
      <h1 class="text-primary"> System Settings </h1>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}"> Dashboard</router-link></li>          
          <li class="breadcrumb-item active" aria-current="page">System Variables</li>
        </ol>
      </nav>
        <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h5>System Variables</h5>
              </div>
                <div class="card-body table-responsive">
                  <div v-if="isLoading" class="spinner-border text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <flash-error :hasError="apiErrors" :errors="errors" @dismissError="apiErrors = false"></flash-error>
                    <table class="table table-hover table-striped">
                      <thead>
                          <tr>
                              <th>KEY</th>
                              <th>VALUE</th>
                          </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(setting, index) in settings" :key="index">
                          <td>{{setting.key.replace(/-/g, ' ').replace(/_/g, ' ')}}</td>
                          <td>
                            <template v-if="setting.options !== null">
                                <select v-model="settings[index].value" class="form-control">
                                    <option v-for="(option, key) in setting.options" :key="key" :value="option">{{option}}</option>
                                </select>
                            </template>
                            <template v-else>
                                <input v-model="settings[index].value" class="form-control">
                            </template>
                          </td>
                        </tr>
                        
                      </tbody>

              </table>
              <button @click="saveSettings" class="btn btn-success">Update</button>
                </div>
            </div>
        </div>
     </div>
       
    </main>
</template>

<script>
import { mapActions} from 'vuex'
import flashError from '../components/flashError.vue'

export default {
  
  name: 'system-settings',
  components: {
    flashError
  },

  data() {

    return {
      showAlert: false,
      alertMessage: "",
      valid: false,
      isLoading: false,
      apiErrors: false,
      generalError: false,
      validationErrors: false,
      apiLoading: true,
      settings: []
    }
  },

  computed: {
    
  },
  methods: {

    ...mapActions({
      fetchProjects : 'project/getProjects',
      deleteProject: 'project/deleteProject',
      fetchSystemSettings: 'admin/fetchSystemSettings',
      saveSystemSettings: 'admin/saveSystemSettings'
    }),

    navigate(link) {
      this.$router.push({ name: link });
    },

    saveSettings() {
      if (confirm("Are you sure ?")) {
        let payload = {
          settings: this.settings
        }
        this.apiErrors = false;
        this.isLoading = true;
        this.saveSystemSettings(payload).then(
          (response) => {
            this.$store.commit("showSnackbar", response.data.message)
            this.isLoading = false;
            
          },
          (error) => {
            const errorMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.errors) ||
                      error.message ||
                      error.toString();
             this.errors = errorMessage
             this.$store.commit("showSnackbar", errorMessage)
             this.isLoading = false
             this.apiErrors = true
          }
        )
      }
    }
  },

  created() {
    let isLoggedIn = !!localStorage.getItem("token");
    if(isLoggedIn){
      //put user and translations to vuex state 
      let token = localStorage.getItem("token")
      let loggedInUser = JSON.parse(localStorage.getItem('user'))
      this.$store.commit('auth/SET_TOKEN', token);
      this.$store.commit('auth/SET_USER', loggedInUser);
      
      this.fetchSystemSettings().then(
        (response) => {
          this.settings = response.data.data
        },
        (error) => {
          const errorMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
           console.log(errorMessage)
        }
      )
    }
  },
    
}
</script>

<style scoped>
.project-page {
  padding-top: 4em;
  padding-bottom: 4em;
}
</style>