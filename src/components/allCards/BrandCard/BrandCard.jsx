/* eslint-disable react/prop-types */
import {twMerge} from "tailwind-merge";
import "./BrandCard.scss";
import ImageURL from "../../ImageURL/ImageURL";
import {Link} from "react-router-dom";

const BrandCard = ({className, item}) => {
    return (
        <>
            <Link to={`/campaign/${item?.offers?.id}`}>
                <div className={twMerge("brand-card overflow-hidden hover:cursor-pointer", className)}>
                    <div className="image min-h-[140px] overflow-hidden">
                        <ImageURL className={"hover:scale-[104%] h-full w-full  transition-all duration-[0.5s] object-cover"} image={item?.image}/>
                    </div>
                    <div>
                        <h4>{item?.name}</h4>
                        <p>{item?.description}</p>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default BrandCard;
