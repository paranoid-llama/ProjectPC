import Banner from "./banner";
import BodyWrapper from "./bodywrapper";

export default function BodyWithBanner({children, text, bodySx, bannerSx}) {
    return (
        <>
        <Banner sx={bannerSx}>{text}</Banner>
        <BodyWrapper sx={bodySx}>
            {children}
        </BodyWrapper>
        </>
    )
}