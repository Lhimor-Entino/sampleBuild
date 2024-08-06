
// import './App.css'
import { HomePage } from "./MyComponents/HomePage"

import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./MyComponents/Login";
import { API_BASE_URL, coookie_options } from "./config";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { changeRequestProperty, changeSavingStatus, setRequestingStatus } from "./reducers/requestReducer";
import { toast as sonnerToast } from 'sonner'
import { useEffect, useMemo, useRef, useState } from "react";
import FailedRequestAlertModal from "./MyComponents/Modals/FailedRequestAlertModal";
// import { SavingModal } from "./MyComponents/Modals/SavingModal";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Terminal } from "lucide-react";
import { StatusModal } from "./MyComponents/Modals/StatusModal";



const api = axios.create({ baseURL: API_BASE_URL });
function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [requestFailed,setRequestFailed] = useState<boolean>(false)
  const request_data = useSelector((state:any) => state.request_reducer);
  const request_mode: boolean = useMemo(() => request_data.auto_request, [request_data]);
  // const [request_mode, setRequestMode] = useState<boolean>(false)
  const requesting =  useMemo(() => request_data.requesting, [request_data]);
  const saving =  useMemo(() => request_data.saving, [request_data]);
  const [errorReqMsg,setErrReqMsg] = useState<any>(null);
    const requestDataRef = useRef(request_data);
    const requestModeRef = useRef(request_mode);
    const savingRef = useRef(saving);
    const requestingRef = useRef(requesting);
    useEffect(() => {
      requestDataRef.current = request_data;
      requestModeRef.current = request_data.auto_request;
      savingRef.current = request_data.saving;
    }, [request_data]);


  // ACTIONS
  useEffect(() => {
    // Define the event handler
    const handleKeyDown = (event : KeyboardEvent) => {
    
      if (event.key === 'F1') {
        // Prevent the default action (if needed)
        event.preventDefault();
        
        isReadyForRequest()
  
      }
      if(event.key === "F2"){
        event.preventDefault();
 
        saveEntry()
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); 



  const saveEntry = async () => {


    
    dispatch(changeSavingStatus({newValue : true}))
    savingRef.current = true
      if(!Cookies.get("request_info")){
        sonnerToast.error('No current document', {
          description: 'Please request and try again',
        })
        const request_info = { newValue:{}, property: "request_info" };
        const img_urls = { newValue: [], property: "img_urls" };
        const request_json =  { newValue:{}, property: "request_json" };

        dispatch(changeRequestProperty(request_info))
        dispatch(changeRequestProperty(img_urls))
        dispatch(changeRequestProperty(request_json))
        dispatch(changeSavingStatus({newValue : false}))
        savingRef.current = false

        return;
      }
    const token = Cookies.get("jt")
    const filename = requestDataRef.current.request_info['filename']
    const formData = requestDataRef.current.request_json
    try {
     
      const response = await axios.post(
        `http://192.168.23.84:8007/ddcic/api/beta/document/save/${filename}`,
        formData, // Data to be sent in the request body
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Authorization header
            'Content-Type': 'application/json' // Set content type if needed
          }
        }
      );

      if(response.data){
            Cookies.remove("request_json")
            Cookies.remove("request_info")
            Cookies.remove("img_urls")
            console.log("mode", requestModeRef.current )
        if( requestModeRef.current ){
          isReadyForRequest()
        
        }
        else{

          const request_info = { newValue:{}, property: "request_info" };
          const img_urls = { newValue: [], property: "img_urls" };
          const request_json =  { newValue:{}, property: "request_json" };

          dispatch(changeRequestProperty(request_info))
          dispatch(changeRequestProperty(img_urls))
          dispatch(changeRequestProperty(request_json))
        }
  
        
      }
    } catch (error) {
      console.log(error)
    }finally{
      setTimeout(() => {
        dispatch(changeSavingStatus({newValue : false}))
        savingRef.current = false
      }, 2000); // Delay of 2000 milliseconds (2 seconds)
    
    }
 


  }

  const isReadyForRequest = () => {
    if(Cookies.get("request_info")) {
      sonnerToast.error('You have a pending request', {
        description: 'Please finished it and request again',
      })
    }else{
      handleRequestEntry()
    }
  }
  const handleRequestEntry = async () => {
    if(!Cookies.get("jt")) return
    setRequestFailed(false)
  
    const token = Cookies.get("jt")


    
    if (Cookies.get("request_info")){
  
      const request_info = JSON.parse(Cookies.get("request_info") || "")
      const img_urls = JSON.parse(Cookies.get("img_urls") || "");
      const request_json = JSON.parse(Cookies.get("request_json") || "")

      const request_info_ = { newValue: request_info, property: "request_info" };
      // const img_urls_ = { newValue: [img_urls], property: "img_urls" };
      // const request_json_ =  { newValue: request_json, property: "request_json" };

      dispatch(changeRequestProperty(request_info_))
      dispatch(changeRequestProperty(img_urls))
      dispatch(changeRequestProperty(request_json))
    }else{
      try {
        

        dispatch(setRequestingStatus({newValue:true}))
          requestingRef.current = true
        const response1 = await axios.get(
          "http://192.168.23.84:8007/ddcic/api/beta/document/verify-request", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        
  
        const response2 = await axios.get(`http://192.168.23.84:8007/ddcic/api/beta/document/get-image/${response1.data.filename}/${1}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: "blob",
        })
  
        const blob = new Blob([response2.data], { type: "jpg" });
        const url = URL.createObjectURL(blob);
  
      
        const response3 = await axios.get(`http://192.168.23.84:8007/ddcic/api/beta/document/get-ocr-data/${response1.data.filename}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
         // Create a new object without the ocrDataList property
      const { ocrDataList, ...rest } = response1.data;
      console.log(rest)
  
      // return rest;
        const request_info = { newValue: rest, property: "request_info" };
        const img_urls = { newValue: [url], property: "img_urls" };
        const request_json =  { newValue: response3.data, property: "request_json" };

        
        dispatch(changeRequestProperty(request_info))
        dispatch(changeRequestProperty(img_urls))
        dispatch(changeRequestProperty(request_json))
        //dispatch(changeRequestProperty(request_json_))
        Cookies.set("request_info", JSON.stringify(rest),coookie_options)
        Cookies.set("img_urls", JSON.stringify(img_urls),coookie_options)
        Cookies.set("request_json", JSON.stringify(request_json),coookie_options)

     
       
      } catch (error:any) {
        console.log(error)
        console.log("here")
        setRequestFailed(true)
        setErrReqMsg(error.response.data)
      }finally{
        dispatch(setRequestingStatus({newValue:false}))
        requestingRef.current = false
      }
    }

  }

  const logout = () => {

    if (Cookies.get("request_info")){
      sonnerToast.warning('You have a pending request', {
        description: 'Please finished it and change your auto request mode off.',
      })
      return
    }
    Cookies.remove("jt")
    navigate("login")
  }

  const hasPendingRequest = () => {
    if (Cookies.get("request_info")) return true;

    return false
  }
  useEffect(() =>{
    console.log(requestDataRef.current)
  },[request_data])


  return (
    <div >
      
    {savingRef.current === true ? <StatusModal  message="Saving your progress"/> : "" } 

    {requestingRef.current === true ? <StatusModal  message="Requesting for entry"/> : "" } 

    {requestFailed && <FailedRequestAlertModal errMsg={errorReqMsg} handleRequestEntry={handleRequestEntry} setRequestFailed={setRequestFailed}/>}
      {/* {savingRef.current === true && toast('Event has been created')} */}
      <Routes>
        <Route path="/" element={<HomePage api={api} handleRequestEntry={handleRequestEntry} isReadyForRequest={isReadyForRequest}  saveEntry={saveEntry} logout={logout} hasPendingRequest={hasPendingRequest}/>  } />
        <Route path="login" element={<Login />}></Route>
      </Routes>



    </div>
  )
}

export default App
