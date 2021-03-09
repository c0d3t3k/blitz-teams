import { dynamic } from "blitz";

export const Wrapper = (props) => {
    const Component = dynamic(() => import("../wrappedPages/authEnd"), {
        ssr: false,
    })

    return <Component {...props}/>
}

export default Wrapper;