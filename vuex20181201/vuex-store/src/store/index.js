
//store import;

import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import courtType from './modules/courtType';
import globalStatus from './modules/globalStatus';
import videoStorage from './modules/videoStorage';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    courtType,
    globalStatus,
    videoStorage,
  },
  getters,
})
