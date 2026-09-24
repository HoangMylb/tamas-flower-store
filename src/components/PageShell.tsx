import {Header} from "./Header"; import {Footer} from "./Footer"; import {ContactBar} from "./ContactBar";
export function PageShell({children}:{children:React.ReactNode}){return <><Header/><main>{children}</main><Footer/><ContactBar/></>}
