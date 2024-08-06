
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { changeOtherData } from "@/reducers/requestReducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props{
    label:string;
    value:string;
    property:string;
    disable?:boolean;


}
export const BillingInput = (props: Props) => {
    const {label,value,property,disable} = props
    const request_data = useSelector((state: any) => state.request_reducer);
    const dispatch = useDispatch()
    const [noData,setNoData] = useState<boolean>(false)
    useEffect(() => {
        if (JSON.stringify(request_data.request_json) !== "{}") {

            setNoData(false)
        } else {
            setNoData(true)
        }

    }, [request_data])

  return (
    <div className="w-full">
        
        <Label>{label} </Label>

        {noData 
        ?  
        <Input  className="mt-1" disabled={true } value={""} onChange={()=> {}} /> 
        :
        <Input  className="mt-1 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100" disabled={disable ? disable :false} value={value} onChange={(e)=> dispatch(changeOtherData({newValue: e.target.value, property}))} />
         }

    </div>
  )
}
