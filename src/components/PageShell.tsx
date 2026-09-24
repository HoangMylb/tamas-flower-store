import {Header} from "./Header"; import {Footer} from "./Footer"; import {ContactBar} from "./ContactBar"; import {MotionReveal} from "./MotionReveal";
export function PageShell({children}:{children:React.ReactNode}){return <MotionReveal><Header/><main>{children}</main><Footer/><ContactBar/></MotionReveal>}
