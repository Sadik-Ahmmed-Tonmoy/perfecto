import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img1 from "../../assets/slimSliderImages/slimImage1.png";
import img2 from "../../assets/slimSliderImages/slimImage2.png";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa6";
import "./SlimSlider.scss";
import ImageURL from "../ImageURL/ImageURL";
import cn from "../../utils/cn";

const SlimSlider = ({className, dots, item}) => {
    // Function declarations to avoid access-before-initialization issue
    function CustomPrevArrow(props) {
        return (
            <div
                // h-16 xs:h-24 sm:h-36 md:h-48 lg:h-52
                className={cn(
                    "custom-prev-arrow absolute left-2 z-10 bg-white top-[30%] xs:top-[35%] sm:top-[40%]  rounded-full p-1  md:p-3 hover:cursor-pointer",
                    className
                )}
                onClick={props.onClick}
                // style={{ position: 'absolute', left: 10, zIndex: 1 }}
            >
                <FaChevronLeft className="text-[#000000A6] h-3 w-3 xs:h-4 xs:w-4"/>
            </div>
        );
    }

    function CustomNextArrow(props) {
        return (
            <div
                className="custom-next-arrow absolute right-2 z-10 bg-white top-[30%] xs:top-[35%] sm:top-[40%]  rounded-full p-1 md:p-3 hover:cursor-pointer"
                onClick={props.onClick}
                // style={{ position: 'absolute',  right: 10, zIndex: 1 }}
            >
                <FaChevronRight className="text-[#000000A6] h-3 w-3 xs:h-4 xs:w-4"/>
            </div>
        );
    }

    const settings = {
        dots: {dots},
        // infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <CustomPrevArrow/>,
        nextArrow: <CustomNextArrow/>,
        dotsClass: "custom-dots",
    };

    // PropTypes validation for the custom arrow components
    CustomPrevArrow.propTypes = {
        onClick: PropTypes.func.isRequired,
    };

    CustomNextArrow.propTypes = {
        onClick: PropTypes.func.isRequired,
    };

    return (
        <div>
            <Slider {...settings}>
                {item?.map((item, i) => (
                    <div key={i}>
                        <ImageURL className={"h-16 xs:h-24 sm:h-36 md:h-48 lg:h-52 w-full"} image={item?.image}/>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SlimSlider;
