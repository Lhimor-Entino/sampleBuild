import { Input } from "@/components/ui/input";
import { InfoFields } from "@/Mytypes";

import { changeBillingInfoData } from "@/reducers/requestReducer";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


interface AccountProps {
    identifier?: string

}

export function Accounts(props: AccountProps) {
    const dispatch = useDispatch();
    const { identifier } = props
    const request_data = useSelector((state: any) => state.request_reducer);
   // const dataFields_: InfoFields = useMemo(() => identifier === "consignee" ? request_data.request_json.consignee : identifier === "shipper" ? request_data.request_json.shipper : request_data.request_json.billTo, [request_data, request_data.request_json]);
    const requesting = useMemo(() => request_data.requesting, [request_data]);
    const [dataFields, setDataFields] = useState<InfoFields>()
    const [noData,setNoData] = useState<boolean>(false)
    useEffect(() => {
        if (JSON.stringify(request_data.request_json) !== "{}") {
                setNoData(false)
            setDataFields(identifier === "consignee" ? request_data.request_json.consignee : identifier === "shipper" ? request_data.request_json.shipper : request_data.request_json.billTo)
        } else {
            setDataFields({
                code: "",
                name: "",
                contactName: "",
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                zipCode: ""
            })
            setNoData(true)
        }

    }, [request_data])

    return (
        <div className="grid gap-2">

            <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-2 col-span-1">
                    <Input  disabled={requesting || noData} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "code", }))} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100 " id={identifier || "" + 'code'} placeholder="Code#" value={dataFields?.code} />
                </div>
                <div className="grid gap-2 col-span-2">
                    <Input autoComplete={"off"}  disabled={requesting || noData} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "name", }))} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100 " id={identifier || "" + 'name'} placeholder="Name" value={dataFields?.name} />
                </div>
            </div>
            <div>
                <Input disabled={requesting || noData} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "addressLine1", }))} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100" id={identifier || "" + 'address-line1'} type="text" placeholder="Address Line 1" value={dataFields?.addressLine1} />
            </div>
            <div>
                <Input disabled={requesting || noData} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "addressLine2", }))} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100" id={identifier || "" + 'address-line2'} type="text" placeholder="Address Line 2" value={dataFields?.addressLine2} />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <Input disabled={requesting || noData} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100" id={identifier || "" + 'city'} placeholder="City" value={dataFields?.city} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "city", }))} />
                <Input disabled={requesting || noData} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100" id={identifier || "" + 'state'} placeholder="State" value={dataFields?.state} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "state", }))} />
                <Input disabled={requesting || noData} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100" id={identifier || "" + 'zip'} placeholder="ZipCode" value={dataFields?.zipCode} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "zipCode", }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                    <Input disabled={requesting || noData} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100" id={identifier || "" + 'contact-number'} placeholder="Phone#" value={dataFields?.phone} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "phone", }))} />
                </div>
                <div className="grid gap-2">
                    <Input disabled={requesting || noData} className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0  focus:bg-blue-100" id={identifier || "" + 'contact-name'} placeholder="Contact Name" value={dataFields?.contactName} onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "contactName", }))} />
                </div>
            </div>
        </div>
    )
}