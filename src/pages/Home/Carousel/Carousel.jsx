import {useContext, useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import {Pagination} from "swiper/modules";
import {Skeleton} from "antd";
import ImageURL from "../../../components/ImageURL/ImageURL.jsx";
import useHomeBanner from "../../../hooks/useHomeBanner.js";
import {LogicProviderContext} from "../../../providers/LogicProvider.jsx";
import {Link} from "react-router-dom";

const Carousel = ({items}) => {
    const {windowWidth} = useContext(LogicProviderContext);
    return (
        <>
            <Swiper
                slidesPerView={1}
                loop={true}
                autoplay={{delay: 3000}}
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {windowWidth <= 640 && (
                    <>
                        {items?.section_data?.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Link to={`/campaign/${item?.offers?.id}`}>
                                    <div className="relative w-full h-28 rounded-xl object-fill overflow-hidden">
                                        <ImageURL className="h-full w-full object-fill" image={item?.image && item?.image}/>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </>
                )}
                {windowWidth >= 641 && (
                    <>
                        {items?.section_data?.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Link to={`/campaign/${item?.offers?.id}`}>
                                    <div className="relative w-full h-96 rounded-xl object-fill overflow-hidden">
                                        <ImageURL className="h-full w-full object-fill" image={item?.image && item?.image}/>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </>
                )}
            </Swiper>
        </>
    );
};

export default Carousel;
