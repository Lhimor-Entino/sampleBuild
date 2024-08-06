
// import { useNavigate } from "react-router-dom"
import {
  BookOpenIcon,
  FileCog2Icon,
  ImageIcon,
  PencilLine,
  ViewIcon,
} from "lucide-react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import { Accounts } from "./Accounts"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Items } from "@/Mytypes"
import ImageViewer from "@/MyComponents/ImageViewer"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"
import { useEffect, useMemo, useRef, useState } from "react"
import Cookies from "js-cookie"
import { AxiosInstance } from "axios"
import { useDispatch, useSelector } from "react-redux"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { addInstruction, addItems, changeInstructionsData, changeItemData, changeOtherData, changeRequestMode } from "@/reducers/requestReducer"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { BillingInput } from "./BillingInput"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import logo from "@/assets/img/ddc_connect3_dark_red.png"
import logo_light from "@/assets/img/ddc_connect3.png"
import { coookie_options } from "@/config"
import SideBar from "./SideBar"
interface Props {
  api: AxiosInstance,
  handleRequestEntry: () => void;
  isReadyForRequest: () => void;
  saveEntry: () => void;
  logout: () => void;
  hasPendingRequest: () => boolean
}

interface OtherDisplay {
  label: string;
  property: string
}

const otherDataToDisplay: OtherDisplay[] = [
  { label: "BOL Number", property: "bolNumber" },
  { label: "Driver Number", property: "driverNumber" },
  { label: "Econtrol Number", property: "econtrolNumber" },
  { label: "Master BOL Number", property: "masterBolNumber" },
  { label: "PO Number", property: "poNumber" },
  { label: "PRO Number", property: "pronumber" },
  { label: "Quote Number", property: "quoteNumber" },
  { label: "RA Number", property: "raNumber" },
  { label: "RUN Number", property: "runNumber" },
  { label: "Shipper Number", property: "shipperNumber" },
]

const otherItemDataToDisplay: OtherDisplay[] = [
  { label: "Total Handling Unit", property: "totalHandlingUnit" },
  { label: "Total Pallet Count", property: "totalPalletCount" },
  { label: "Total Pieces", property: "totalPieces" },
  { label: "Total Weight", property: "totalWeight" }
]
export function HomePage(props: Props) {

  const { handleRequestEntry, isReadyForRequest, saveEntry, logout } = props
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const request_data = useSelector((state: any) => state.request_reducer);
  const theme_data = useSelector((state: any) => state.theme_reducer);
  const request_mode = useMemo(() => request_data.auto_request, [request_data]);
  const items: Items[] = useMemo(() => request_data.request_json.items, [request_data]);
  const instructions: any = useMemo(() => request_data.request_json.instructions, [request_data])
  const requesting = useMemo(() => request_data.requesting, [request_data]);
 // const saving = useMemo(() => request_data.saving, [request_data]);
  const theme = useMemo(() => theme_data.current_theme, [theme_data]) || "dark";
//  const [imgUrls, setImgUrls] = useState<ImageUrls[]>([])
  const [currentImg, setCurrentImg] = useState("")

  const themeRef = useRef(theme)



  useEffect(() => {

    if (request_mode) {
      handleRequestEntry()
    }

  }, [])

  useEffect(() => {
    if (request_data.img_urls.length < 1) {
      setCurrentImg("")
     // setImgUrls([])
      return;
    }
    const image_urls_ = request_data.img_urls.map((img: string) => ({ url: img }))

    console.log(image_urls_)
    //setImgUrls(image_urls_)
    setCurrentImg(image_urls_[0].url)
  }, [request_data])


  useEffect(() => {

    // if (!Cookies.get("jt")) {
    //   navigate("login")
    //   return
    // };
  }, [])

  useEffect(() => {

    if (!items) return;

    const total_pallet = items.reduce((sum, item) => {
      const val = parseInt(item.pallet || "0", 10); // Convert string to number
      return sum + (isNaN(val) ? 0 : val); // Add to sum if valid
    }, 0);
    const total_pieces = items.reduce((sum, item) => {
      const val = parseInt(item.pieces || "0", 10); // Convert string to number
      return sum + (isNaN(val) ? 0 : val); // Add to sum if valid
    }, 0);
    const total_unit = items.reduce((sum, item) => {
      const val = parseInt(item.handlingUnit || "0", 10); // Convert string to number
      return sum + (isNaN(val) ? 0 : val); // Add to sum if valid
    }, 0);
    const total_weight = items.reduce((sum, item) => {
      const val = parseFloat(item.weight || "0.3"); // Convert string to float
      return sum + (isNaN(val) ? 0 : val); // Add to sum if valid
    }, 0);

    dispatch(changeOtherData({ newValue: total_pallet, property: "totalPalletCount" }))
    dispatch(changeOtherData({ newValue: total_pieces, property: "totalPieces" }))
    dispatch(changeOtherData({ newValue: total_unit, property: "totalHandlingUnit" }))
    dispatch(changeOtherData({ newValue: total_weight, property: "totalWeight" }))
  }, [items])


  useEffect(() => {
    Cookies.set("auto_request", request_mode, coookie_options)

  }, [request_mode])

  return (
    <div className={cn(requesting ? "cursor-wait" : "")}>

      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <SideBar logout={logout} themeRef={themeRef} />
        <div className="flex flex-col h-screen sm:gap-4 sm:py-4 sm:pl-14">

          <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 mb-4">

            <div className="flex justify-between w-full items-center">
              <div className="w-80">
                <img src={themeRef.current == "dark" ? logo_light : logo} className="w-full h-20" />

              </div>
              <div className="flex items-center">
                <Menubar >
                  <MenubarMenu >
                    <MenubarTrigger><FileCog2Icon className="w-4 h-4 mr-1" /> File</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem disabled={requesting } onClick={() => saveEntry()}>
                        Save <MenubarShortcut>F2</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem disabled={requesting} onClick={() => isReadyForRequest()}>
                        Request <MenubarShortcut>F1</MenubarShortcut>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                  <MenubarMenu>
                    <MenubarTrigger><PencilLine className="h-4 w-4 mr-2" /> Image Control</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem disabled={requesting}  >
                        Rotate Left <MenubarShortcut>⌘+L</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem disabled={requesting}  >
                        Flip <MenubarShortcut>⌘+F</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem disabled={requesting}  >
                        Zoom In <MenubarShortcut>⌘+I</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem disabled={requesting}  >
                        Zoom Out <MenubarShortcut>⌘+O</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem disabled={requesting}  >
                        Reset <MenubarShortcut>⌘+S</MenubarShortcut>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                  <MenubarMenu>
                    <MenubarTrigger> <ViewIcon className="w-4 h-4 mr-2" /> View</MenubarTrigger>
                    <MenubarContent>

                      <MenubarItem inset disabled={requesting}  >
                        Reload <MenubarShortcut>⌘R</MenubarShortcut>
                      </MenubarItem>

                      <MenubarSeparator />
                      <MenubarItem inset disabled={requesting}  >Toggle Fullscreen</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem inset disabled={requesting}  >Hide Sidebar</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>

                </Menubar>
                <div className="flex items-center space-x-2 ml-3">
                  <Switch className="bg-red-900" disabled={requesting} id="airplane-mode" checked={request_mode} onCheckedChange={() => dispatch(changeRequestMode({ newValue: !request_mode }))} />
                  <Label htmlFor="airplane-mode">Auto Request </Label>
                </div>
              </div>

            </div>

          </header>
          <main className="grid flex-1 h-5/6">
            {/* {JSON.stringify(request_data)} */}
            <ResizablePanelGroup direction="horizontal" className="rounded-lg">
              <ResizablePanel defaultSize={35} minSize={35}>
                <div className="grid px-6">

                  <div className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-1" />
                    <p className=" font-semibold p-2 rounded">Image Viewer</p>
                  </div>

                  <div className="p-4 border mt-4 rounded-md h-[720px]">

                    <div className="relative z-10 w-fit h-fit mb-20">
                      {currentImg ? <ImageViewer image={currentImg}
                        alt="temp.jpg" /> : <img

                        src="https://ui.shadcn.com/placeholder.svg"
                        alt="Image"
                        // width="1920"
                        // height="1080"
                        className={cn(
                          {
                            "animate-pulse": request_data.saving,
                          },
                          "h-full w-full object-cover dark:brightness-[0.1] dark:grayscale"
                        )}
                      />}

                    </div>

                    <div className="w-full  flex items-center justify-center">
                      {/* <Carousel
                        opts={{
                          align: "start",
                        }}
                        className="w-5/6"
                      >
                        <CarouselContent className="w-full">
                          {imgUrls.length > 0 ? imgUrls.map((url, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                              <div className="p-1">
                                <Card className="hover:cursor-pointer">
                                  <CardContent className="flex aspect-square items-center justify-center p-2" onClick={() => setCurrentImg(url.url)}>
                                    <img src={url.url} />
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          )) : ""}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel> */}
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="w-1" />
              <ResizablePanel defaultSize={65} minSize={50}>
                <div className={cn(
                  {
                    "animate-pulse": request_data.saving,
                  },
                  "grid w-full gap-4 pl-6 overflow-y-auto  overflow-x-scroll scrollbar-hide"
                )} style={{ height: "100%" }}>

       
                  <div className="flex items-center">
                    <BookOpenIcon  className="w-5 h-5 mr-1"/>
                   <p className=" font-semibold p-2 rounded">Billing Information</p>
                  </div>
                  <div className="grid gap-2 grid-cols-4">

                    {request_data.request_json ? otherDataToDisplay.map((display: any, index: number) => <BillingInput key={index} value={request_data.request_json[display.property]} property={display.property} label={display.label} />) : ""}
                  </div>

                  <div className="flex flex-col flex-wrap w-full gap-4 accounts-wrapper sm:flex-row">

                    <div className="grid flex-1 w-full gap-4">
                      <Card x-chunk="accounts-01-chunk-2">
                        <CardHeader>
                          <CardTitle className="text-sm">Consignee</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accounts identifier="consignee" key={1} />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid flex-1 w-full gap-6">
                      <Card x-chunk="accounts-02-chunk-2">
                        <CardHeader>
                          <CardTitle className="text-sm">Shipper</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accounts identifier="shipper" key={2} />
                        </CardContent>
                      </Card>
                    </div>


                    <div className="grid flex-1 w-full gap-6">
                      <Card x-chunk="accounts-03-chunk-2">
                        <CardHeader>
                          <CardTitle className="text-sm">Bill To</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <Accounts identifier="bill_to" key={3} />
                        </CardContent>
                      </Card>
                    </div>

                  </div>
                  <div className="grid flex-1 w-full gap-6">
                    <Card x-chunk="entry-02-chunk-2">
                      <CardHeader>
                        <CardTitle className="text-sm">

                          <div className="flex justify-between">
                            <p> Instructions</p>
                            <Button className="bg-red-900  hover:bg-red-900 dark:bg-white dark:hover:bg-white" size={"sm"} disabled={requesting || !Cookies.get("request_info")} onClick={() => dispatch(addInstruction())}>Add Instructions</Button>
                          </div>

                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">

                        {
                          instructions ?
                            [instructions]?.map((td: any) =>

                              td.lines.map((index: number) =>
                                <Input className=" focus:bg-blue-100 focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} key={index} value={td.lines[index].content} onChange={(e) => dispatch(changeInstructionsData({ parent_property: "lines", index, property: "content", newValue: e.target.value }))} />)
                            )
                            : ""}

                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid flex-1 w-full gap-6">
                    <Card x-chunk="entry-03-chunk-2">
                      <CardHeader>
                        <CardTitle className="text-sm">
                          <div className="flex justify-between">
                            <p> Items</p>
                            <Button className="bg-red-900 hover:bg-red-900 dark:bg-white dark:hover:bg-white" disabled={requesting || !Cookies.get("request_info")} size={"sm"} onClick={() => dispatch(addItems())}>Add Item</Button>
                          </div>


                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="grid gap-2 grid-cols-4">
                          {request_data.request_json ? otherItemDataToDisplay.map((display: any, index: number) => <BillingInput disable={true} key={index} value={request_data.request_json[display.property]} property={display.property} label={display.label} />) : ""}
                        </div>
                        <Table>
                          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                          <TableHeader>
                            <TableRow>
                              <TableHead >Pallet</TableHead>
                              <TableHead>Handling Unit</TableHead>
                              <TableHead>Package Type</TableHead>
                              <TableHead >Pieces</TableHead>
                              <TableHead >Description</TableHead>
                              <TableHead>Weight</TableHead>
                              <TableHead>Item Class</TableHead>
                              <TableHead >NMFC</TableHead>
                              <TableHead >Dimension</TableHead>

                            </TableRow>
                          </TableHeader>
                          <TableBody>

                            {items?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell > <Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.pallet} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "pallet", }))} /></TableCell>
                                <TableCell> <Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.handlingUnit} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "handlingUnit", }))} /> </TableCell>
                                <TableCell> <Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.packageType} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "packageType", }))} /></TableCell>
                                <TableCell ><Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.pieces} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "pieces", }))} /> </TableCell>

                                <TableCell > <Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.description} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "description", }))} /></TableCell>
                                <TableCell> <Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.weight} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "weight", }))} /> </TableCell>
                                <TableCell> <Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.itemClass} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "itemClass", }))} /></TableCell>
                                <TableCell ><Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.nmfc} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "nmfc", }))} /> </TableCell>
                                <TableCell ><Input className=" focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 " disabled={requesting} value={item.dimension} onChange={(e) => dispatch(changeItemData({ newValue: e.target.value, index, property: "dimension", }))} /></TableCell>

                              </TableRow>
                            ))}
                          </TableBody>

                        </Table>

                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </main>
        </div>
      </div>
    </div>

  )
}
