import { create } from "zustand";

const useDatoStore = create((set) => ({
  // const [data, setData] = useState([])
  data: [],
  setData: (datos) => set({data: datos})
  
}))

export default useDatoStore