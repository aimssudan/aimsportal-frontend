<template>
  <main class="page about-page" style="min-height: 80vh">
    <div class="container">
      <h1 class="text-primary">Organisation Categories</h1>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'organisations' }">
              Organisations</router-link
            >
          </li>
          <li class="breadcrumb-item active" aria-current="page">Categories</li>
        </ol>
      </nav>
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h5 class="float-start">Organisation Categories</h5>

            <router-link :to="{ name: 'organisation-category' }"
              ><button class="float-end btn btn-warning">
                New
              </button></router-link
            >
          </div>
          <div class="card-body">
            <div
              v-if="isLoading"
              class="spinner-border text-warning"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <flash-error
              :hasError="apiErrors"
              :errors="errors"
              @dismissError="apiErrors = false"
            ></flash-error>
            <table class="table table-hover table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cat, index) in categories" :key="cat.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ cat.name }}</td>
                  <td>
                    <div class="btn-group" role="group" aria-label="Actions">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="
                          this.$router.push({
                            name: 'organisation-category',
                            params: { id: cat.id },
                          })
                        "
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger"
                        @click="deleteItem(cat)"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import flashError from "../components/flashError.vue";

export default {
  components: {
    flashError,
  },

  data() {
    return {
      isLoading: false,
      apiErrors: false,
      errors: [],
    };
  },
  computed: {
    ...mapState("global", ["organisationCategories"]),
    categories() {
      return this.organisationCategories;
    },
  },
  methods: {
    ...mapActions({
      deleteCat: "global/deleteOrganisationCategory",
    }),
    deleteItem(category) {
      if (confirm("Are you sure ?")) {
        this.isLoading = true;
        this.deleteCat(category.id).then(
          (response) => {
            this.isLoading = false;
            let message = response.data.data.message ?? "Successfully Deleted";
            this.$store.commit("global/DELETE_ORGANISATION_CATEGORY", category);
            this.$store.commit("showSnackbar", message);
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            this.isLoading = false;
            this.apiErrors = true;
            this.errors = resMessage;
          }
        );
      }
    },
  },
  created() {
    let isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      //put user and translations to vuex state
      let token = localStorage.getItem("token");
      let loggedInUser = JSON.parse(localStorage.getItem("user"));
      this.$store.commit("auth/SET_TOKEN", token);
      this.$store.commit("auth/SET_USER", loggedInUser);
    }
  },
};
</script>

<style scoped>
.page {
  padding-top: 4em;
  padding-bottom: 4em;
}

/* Card header */
.about-page .card .card-header {
  background-color: rgba(0, 41, 117, 0.87);
  transform: translatex(0px) translatey(0px);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

/* Heading */
.card .card-header h5 {
  color: #ffffff;
  font-weight: 600;
  margin-top: 5px;
  margin-bottom: 5px;
}

/* Card */
#app #app-content .about-page .container .col-md-12 .card {
  width: 68% !important;
}

/* Card */
.about-page .card {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0px 0px 13px 0px rgba(44, 62, 80, 0.1);
}

/* Card body */
.about-page .card .card-body {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: translatex(0px) translatey(0px);
}

/* Button */
.card-header a .btn-warning {
  margin-right: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
}

/* Button */
.table-striped tr .btn-primary {
  border-top-right-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
}

/* Button */
.table-striped tr .btn-danger {
  border-bottom-left-radius: 6px !important;
  border-top-left-radius: 6px !important;
}

/* About page */
#app-content .about-page {
  transform: translatex(0px) translatey(0px);
}

@media (max-width: 1199px) {
  /* Card */
  #app #app-content .about-page .container .col-md-12 .card {
    width: 850px !important;
  }
}

@media (max-width: 991px) {
  /* Card */
  #app #app-content .about-page .container .col-md-12 .card {
    width: 100% !important;
  }

  /* Table Data */
  .table-striped tr td {
    font-size: 14px;
  }
}

@media (max-width: 575px) {
  /* Table Data */
  .table-striped tr td {
    font-size: 13px;
  }

  /* Button */
  .table-striped tr .btn-primary {
    font-size: 13px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
    height: 30px;
  }

  /* Button */
  .table-striped tr .btn-danger {
    font-size: 13px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  /* Heading */
  .card .card-header h5 {
    font-size: 17px;
  }

  /* Button */
  .card-header a .btn-warning {
    font-weight: 700;
    color: #002866;
    padding-left: 12px;
    height: 35px;
  }
}
</style>
