import {setStore, getStore} from '@/util/store';
import { errorHandler } from "@/libs/iview-cfg";

export default {
  state: {
    courtType: getStore({ name: 'courtType' }) || {}
  },
  mutations: {
    setCourtType(state, courtType){
        state.courtType = courtType;
        setStore({
          name: 'courtType',
          content: courtType,
          type: '',
        });
    },

  }
}

