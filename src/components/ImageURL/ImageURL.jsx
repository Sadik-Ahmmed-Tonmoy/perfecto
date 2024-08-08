/* eslint-disable no-undef */
import {twMerge} from "tailwind-merge";
import imageURLErrorImage from "../../assets/imageURLErrorImage/imageURLErrorImage.png";

const ImageURL = ({style, image, className}) => {
    const handleError = (event) => {
        event.target.src = imageURLErrorImage;
    };

    return (
        <>
            {image && (
                <img
                    className={twMerge("", className)}
                    src={`https://app.perfectoblog.com/${image}`}
                    // src={`${image}`}
                    alt="image"
                    style={style}
                    onError={handleError}
                />
            )}
        </>
    );
};

export default ImageURL;
