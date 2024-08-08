/* eslint-disable react/prop-types */
import {twMerge} from "tailwind-merge";
// import "./EggCard.scss";
import ImageURL from "../../ImageURL/ImageURL";
import {useContext} from "react";
import {LogicProviderContext} from "../../../providers/LogicProvider";
import eggCardImage from "../../../assets/eggCard/egg-card.png";
import {Link} from "react-router-dom";

const EggCard = ({className, item}) => {
    return (
        <div>
            <Link to={`/product-filter?category=${item?.categories?.id}`}>
                <div
                    className={twMerge(` bg-contain bg-center object-cover bg-no-repeat h-[282px] w-[235px] mx-auto flex justify-center items-center overflow-hidden hover:cursor-pointer`, className)}
                    style={{
                        backgroundImage: `url("${eggCardImage}")`,
                    }}
                >
                    <ImageURL className={" max-h-[170px] max-w-[150px] hover:scale-[105%] transition-all"} image={item?.image}/>
                </div>
                <p className="text-center">{item?.categories?.name}</p>
            </Link>
        </div>
    );
};

export default EggCard;
