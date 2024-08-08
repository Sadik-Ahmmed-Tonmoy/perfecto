/* eslint-disable react/prop-types */
import {FaChevronRight} from "react-icons/fa6";
import ImageURL from "../../ImageURL/ImageURL";
import "./DiscountCardForSlider.scss";
import {Link} from "react-router-dom";

const DiscountCardForSlider = ({item}) => {

    return (
        <>
            <Link to={`/campaign/${item?.offers?.id}`}>
                <div className="discount-card-for-slider">
                    <div className="min-h-[150px]">
                        <ImageURL className={"h-full w-full object-fill"} image={item?.image}/>
                    </div>
                    <div className="titles">
                        <div>
                            <h4 className="text-xl">{item?.name}</h4>
                            <p>{item?.description}</p>
                        </div>
                        <div className="button">
                            <FaChevronRight className="text-white"/>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default DiscountCardForSlider;
