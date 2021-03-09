import { dynamic } from "blitz";

export const TabWrapper = (props) => {
    const Tab = dynamic(() => import("../wrappedPages/tab"), {
        ssr: false,
    })

    return <Tab {...props}/>
}

export default TabWrapper;