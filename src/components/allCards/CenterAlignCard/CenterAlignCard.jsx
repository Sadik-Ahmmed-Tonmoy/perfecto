/* eslint-disable react/prop-types */
import {Spin, Tooltip} from "antd";
import {Fragment, useEffect, useState} from "react";
import {BsCheck} from "react-icons/bs";
import {FaCheck, FaTimes} from "react-icons/fa";
import {FaHeart, FaRegHeart} from "react-icons/fa6";
import {IoCartOutline, IoCartSharp, IoClose, IoCloseSharp} from "react-icons/io5";
import {Link, useNavigate} from "react-router-dom";
import useAuthUser from "../../../hooks/useAuthUser";
import useCartData from "../../../hooks/useCartData";
import {useAddToCartMutation} from "../../../redux/features/cart/cartApi";
import {useAddToWishListMutation, useGetWishListQuery} from "../../../redux/features/wishList/wishListApi";
import {checkCart, checkWishList} from "../../../utilities/checkCartIfExist";
import showToast from "../../../utilities/showToast";
import ImageURL from "../../ImageURL/ImageURL";
import StarRating from "../../StarRating/StarRating";
import Button from "../../ui/Button";
import "./CenterAlignCard.scss";
import {LoadingOutlined} from "@ant-design/icons";
import {useStockRequestMutation} from "../../../redux/features/requestStock/requestStockApi";
import {useGetContactQuery} from "../../../redux/features/contact/contactApi";
import Swal from "sweetalert2";

const CenterAlignCard = ({item}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPreviewShade, setIsPreviewShade] = useState(false);
    const [isPreviewSize, setIsPreviewSize] = useState(false);
    const [addToBagAnimation, setAddToBagAnimation] = useState(false);
    const [cartShake, setCartShake] = useState(false);
    const [addedToBag, setAddedToBag] = useState(false);
    const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);
    const [selectedShade, setSelectedShade] = useState({});
    const [selectedSize, setSelectedSize] = useState({});
    const [selectedProduct, setSelectedProduct] = useState({});
    const [selectedCheckbox, setSelectedCheckbox] = useState("");
    const [mainPrice, setMainPrice] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [addToCartMutation, {data, isLoading: addToCartIsLoading}] = useAddToCartMutation();
    const [stockRequestMutation, {isLoading: stockRequestIsLoading}] = useStockRequestMutation();
    const [addToWishListMutation] = useAddToWishListMutation();
    const {userData} = useAuthUser();
    const navigate = useNavigate();
    const {cartData, cartRefetch} = useCartData();
    const {data: wishListItems} = useGetWishListQuery();
    const {data: getContactQuery} = useGetContactQuery();
    const [cartDataList, setCartDataList] = useState([]);
    const [wishListData, setWishListData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            if (cartData?.status) {
                setCartDataList(cartData?.data?.cartData);
            }
        }, 2000);
    }, [cartData]);
    useEffect(() => {
        setWishListData(wishListItems?.data);
    }, [wishListItems]);

    let cartItemIsExist = checkCart(cartDataList, selectedProduct);
    let wishListItemIsExist = checkWishList(wishListData, selectedProduct);
    //

    const productWithTypeId3 = item?.offers?.offer_details?.filter((element) => element?.product_details?.offer?.offer_type_id == "3");

    const handleSelectedShadeData = (id, productId) => {
        const selectedShade = item?.product_shades.find((shade) => shade.shade_id == id);
        if (selectedShade) {
            setSelectedShade(selectedShade);
            setSelectedProduct({...selectedShade, productId});
            setMainPrice(selectedShade?.shade_price);
            setDiscountedPrice(parseFloat(selectedShade?.discounted_price));
        }
    };

    const handleSelectedSizeData = (id, productId) => {
        const selectedSize = item?.product_sizes.find((size) => size.size_id == id);
        if (selectedSize) {
            setSelectedSize(selectedSize);
            setSelectedProduct({...selectedSize, productId: productId});
            setSelectedCheckbox(selectedSize?.size?.name);
            setMainPrice(selectedSize?.size_price);
            setDiscountedPrice(parseFloat(selectedSize?.discounted_price));
        }
    };

    const handleCheckboxChange = (key) => {
        // Update the selected checkbox state
        setSelectedCheckbox(key);

        // Get the existing search parameters
        const searchParams = new URLSearchParams(location.search);

        // Update the 'sort_by' parameter
        searchParams.set("sort_by", key);

        // Update the URL
        // navigate(`${link}?${searchParams.toString()}`);
    };

    useEffect(() => {
        if (item?.product_shades?.length > 0) {
            const availableShadesOnStock = item?.product_shades?.filter((shade) => shade?.stock !== null && shade?.stock != 0);
            const sortedByStock = [...availableShadesOnStock].sort((a, b) => b.stock - a.stock);
            const initialSelectedShadeId = sortedByStock?.[0]?.shade_id;
            if (initialSelectedShadeId) {
                handleSelectedShadeData(initialSelectedShadeId, item?.id);
            } else {
                handleSelectedShadeData(item?.product_shades?.[0]?.shade_id, item?.id);
            }
        } else if (item?.product_sizes?.length > 0) {
            const availableSizesOnStock = item?.product_sizes?.filter((size) => size?.stock !== null && size?.stock != 0);
            const sortedByStock = [...availableSizesOnStock].sort((a, b) => b.stock - a.stock);
            const initialSelectedSizeId = sortedByStock?.[0]?.size_id;
            if (initialSelectedSizeId) {
                handleSelectedSizeData(initialSelectedSizeId, item?.id);
            } else {
                handleSelectedSizeData(item?.product_sizes?.[0]?.size_id, item?.id);
            }
        }
    }, [item]);

    // useEffect(() => {
    //     if (item?.product_shades.length > 0) {
    //
    //         const initialSelectedShadeId = item?.product_shades[0]?.shade_id;

    //         if (initialSelectedShadeId) {
    //             handleSelectedSizeData(initialSelectedShadeId);
    //         }
    //     }
    // }, [item]);

    useEffect(() => {
        setCartShake(true);
        if (addToBagAnimation) {
            setTimeout(() => {
                setAddToBagAnimation(false);
                setAddedToBag(true);
            }, 3000);
        }
        if (addToBagAnimation) {
            setTimeout(() => {
                setCartShake(false);
            }, 800);
        }
    }, [addToBagAnimation]);

    const handleAddToCart = async (item) => {
        //
        if (userData?.status === true) {
            const data = {
                product_id: item?.product_id,
                size_id: item?.size_id,
                // color_id: 30,
                shade_id: item?.shade_id,
                quantity: 1,
                // combo_product_id: 30,
                // combo_info: 30,
            };

            try {
                const response = await addToCartMutation(data);
                if (response?.data?.status) {
                    setAddToBagAnimation(true);
                    cartRefetch();
                    showToast(response?.data?.message, "success", "top-end", 2000);
                } else {
                    showToast(response?.data?.message, "error", "top-end", 2000);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        } else {
            showToast("Please Login First", "info", "top-end", 5000);
            navigate("/login-with-email");
        }
    };
    const handleRequestStock = async (item) => {
        if (userData?.status === true) {
            const data = {
                product_id: item?.product_id,
                ...(item?.size_id && {size_id: item?.size_id}),
                ...(item?.shade_id && {shade_id: item?.shade_id}),
            };

            try {
                const response = await stockRequestMutation(data);

                if (response?.data?.status) {
                    showToast(response?.data?.message, "success", "top-end", 2000);
                } else {
                    showToast(response?.data?.message, "error", "top-end", 2000);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        } else {
            showToast("Please Login First", "info", "top-end", 5000);
            navigate("/login-with-email");
        }
    };

    const handleWishList = async (item) => {
        //
        if (userData?.status === true) {
            const data = {
                product_id: item?.product_id,
            };
            try {
                const response = await addToWishListMutation(data);
                //
                if (response?.data?.status) {
                    showToast(response?.data?.message, "success", "top-end", 2000);
                } else {
                    showToast(response?.data?.message, "error", "top-end", 2000);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        } else {
            showToast("Please Login First", "info", "top-end", 5000);
            navigate("/login-with-email");
        }
    };
    const handleServiceOff = () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${getContactQuery?.data?.buy_status_note}`,
        });
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                // setIsPreviewShade(false);
            }}
            className="center-align-card hover:cursor-pointer relative w-full min-w-[230px] md:max-w-[380px]"
        >
            <div className="flex items-center absolute top-0 left-0">
                {item?.best_sale == 1 && (
                    <div className="">
                        <h4 className=" text-[#0094CF] text-xs font-medium bg-[#D4F3FF] px-[10px] py-1 rounded-ee-md">Bestseller</h4>
                    </div>
                )}
                {item?.order_details_count > 0 && (
                    <div className="">
                        <h4 className=" text-[#1713DF] text-xs font-medium bg-[#DDDCFF] px-[10px] py-1 rounded-ss-md rounded-ee-md">Offer</h4>
                    </div>
                )}
            </div>
            {/* {
                item?.best_sale == 1 &&  <div className="absolute top-0 left-0">
                <h4 className=" text-[#0094CF] text-xs font-medium bg-[#D4F3FF] px-[10px] py-1 rounded-ee-md">Bestseller</h4>
            </div>
            }
            {
                item?.order_details_count > 0 &&  <div className="absolute top-0 left-0">
                <h4 className=" text-[#0094CF] text-xs font-medium bg-[#D4F3FF] px-[10px] py-1 rounded-ee-md">Offer</h4>
            </div>
            } */}

            <Link to={`/product-details/${item?.id}`}>
                <div className="image h-64 hover:cursor-pointer ">
                    <ImageURL className={"w-full h-full object-fill"} image={item?.image}/>
                    {/* <img className="w-full h-64" src={centerAlignCardImg} alt="" /> */}
                </div>
            </Link>
            <Link to={`/product-details/${item?.id}`}>
                <div className="card-body">
                    {/* <h5>{item?.name}</h5> */}
                    <h5 className="mb-[6px]">{item?.name && (item.name.length > 25 ? `${item.name.slice(0, 25)}...` : item.name)}</h5>
                    <div className="h-[16px] mb-1">
                        {item?.reviews_avg_star && (
                            <div className="rating mb-[6px]">
                                <StarRating rating={item?.reviews_avg_star} totalStars={5} size={15}/>({item?.reviews_count})
                            </div>
                        )}
                    </div>
                    <div className=" h-[22px] mb-1">
                        {productWithTypeId3?.length > 0 && (
                            <div className="flex justify-center items-center gap-1 sm:gap-2">
                                {productWithTypeId3?.slice(0, 2)?.map((offer, index) => (
                                    <div key={index} className="text-[10px] bg-red-500 rounded  px-2 py-1 text-white whitespace-nowrap">
                                        {offer?.title}
                                    </div>
                                ))}
                                {productWithTypeId3?.length > 2 && <p className="text-[10px] bg-red-500 rounded  px-2 py-1 text-white">More</p>}
                            </div>
                        )}
                    </div>
                    {selectedProduct?.discount_percent > 0 ? (
                        <div className="price">
                            <span>৳{discountedPrice}</span>
                            <span>৳{mainPrice}</span>
                            {/* <span>(-{item?.discount_percent}%)</span> */}
                            <span>(-{parseFloat(selectedProduct?.discount_percent).toFixed(0)}%)</span>
                        </div>
                    ) : (
                        <div className="price">
                            <span>৳{mainPrice}</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="text-center border-t-[0.2px]">
                {item?.product_shades?.length > 1 && isHovered ? (
                    <div className="flex items-center">
                        <Button
                            onClick={() => handleWishList(selectedProduct)}
                            className="text-sm px-5 font-medium text-primary-color"
                            variant="ghost"
                        >
                            {wishListItemIsExist == null ? <FaRegHeart size={25}/> : <FaHeart size={25}/>}
                        </Button>
                        {item?.variation_type === "shade" ? (
                            <Button
                                onClick={() => setIsPreviewShade(true)}
                                className="py-[14px] text-sm font-medium w-full rounded-none rounded-br-sm"
                                variant=""
                            >
                                Preview Shades
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsPreviewSize(true)}
                                className="py-[14px] text-sm font-medium w-full rounded-none rounded-br-sm"
                                variant=""
                            >
                                Preview Size
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {item?.product_shades?.length > 1 ? (
                            item?.variation_type === "shade" ? (
                                <p className="text-[#000000CC] py-[14px] text-center text-sm font-medium leading-5">
                                    {item?.product_shades?.length} Shades
                                </p>
                            ) : (
                                <p className="text-[#000000CC] py-[14px] text-center text-sm font-medium leading-5">
                                    {item?.product_sizes?.length} Sizes
                                </p>
                            )
                        ) : (
                            <div>
                                {cartItemIsExist !== null ? (
                                    <div className="bg-primary-color h-12 text-sm text-white flex items-center justify-center rounded-b-sm">
                                        <p>Added To Bag</p>
                                    </div>
                                ) : (
                                    <>
                                        {addToBagAnimation ? (
                                            <div className="bg-primary-color h-12 overflow-hidden">
                                                <div className="add-To-Bag-Animation mt-2">
                                                    {cartShake ? <IoCartOutline size={30} className="text-white"/> : <IoCartSharp size={30} className="text-white"/>}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center w-full rounded-b-sm">
                                                <Button
                                                    onClick={() => handleWishList(selectedProduct)}
                                                    className="text-sm px-5 font-medium text-primary-color"
                                                    variant="ghost"
                                                >
                                                    {wishListItemIsExist == null ? <FaRegHeart size={25}/> : <FaHeart size={25}/>}
                                                </Button>
                                                <>
                                                    {selectedProduct?.stock == 0 || selectedProduct?.stock === null ? (
                                                        <>
                                                            {stockRequestIsLoading ? (
                                                                <Button className="text-sm w-full font-medium py-[14px] rounded-none rounded-br-sm" variant="">
                                                                    Requesting...
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    onClick={() => {
                                                                        handleRequestStock(selectedProduct);
                                                                    }}
                                                                    className="text-sm w-full font-medium py-[14px] rounded-none rounded-br-sm"
                                                                    variant=""
                                                                >
                                                                    Request Stock
                                                                </Button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {addToCartIsLoading ? (
                                                                <Button className="text-sm w-full font-medium py-[14px] rounded-none rounded-br-sm" variant="">
                                                                    <Spin indicator={<LoadingOutlined style={{fontSize: 15}}/>}/> <span className="ms-1">Add to Bag</span>
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    {getContactQuery?.data?.buy_status == 0 ? (
                                                                        <Button
                                                                            onClick={handleServiceOff}
                                                                            className="text-sm w-full font-medium py-[14px] rounded-none rounded-br-sm"
                                                                            variant=""
                                                                        >
                                                                            Add to Bag
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            onClick={() => {
                                                                                handleAddToCart(selectedProduct);
                                                                            }}
                                                                            className="text-sm w-full font-medium py-[14px] rounded-none rounded-br-sm"
                                                                            variant=""
                                                                        >
                                                                            Add to Bag
                                                                        </Button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>


            {isPreviewShade && (
                <div className="absolute top-0 bg-white w-full h-full rounded z-10" style={{boxShadow: "0px 2px 6px 0px rgba(12, 107, 144, 0.06)"}}>
                    <div className="p-3 flex items-center justify-between border-b-[1px]">
                        <p>Select A Shade({item?.product_shades?.length})</p>
                        <Button onClick={() => setIsPreviewShade(false)} variant="ghost">
                            <IoClose size={20}/>
                        </Button>
                    </div>
                    <div className="flex flex-col justify-between ">
                        <div className="flex items-start h-[220px] overflow-hidden overflow-y-auto slim-scroll m-4 ">
                            <div className="flex flex-wrap pt-1 px-[2px] gap-2 ">
                                {/* <div className="w-7 h-7 bg-red-200 rounded hover:cursor-pointer relative">
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10 flex justify-center items-center">
                                        <IoMdClose size={20} className="text-white" />
                                    </div>
                                </div>
                                <div className="w-7 h-7 bg-red-300 rounded hover:cursor-pointer relative">
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10 flex justify-center items-center">
                                        <IoMdCheckmark size={20} className="text-white" />
                                    </div>
                                </div> */}

                                {[...item?.product_shades]?.sort((a, b) => b.stock - a.stock)?.map((product, index) => (
                                    <Fragment key={index}>
                                        {product?.stock == null ? (
                                            <Tooltip placement="top" title={"Stock Out"}>
                                                <div
                                                    className={` rounded hover:cursor-pointer overflow-hidden relative ${
                                                        product?.shade?.id == selectedShade?.shade_id ? "shadow-[rgba(0,0,15,0.5)_0px_0px_2px_2px] border-[2px] border-white w-[37px] h-[37px]" : "w-9 h-9"
                                                    }`}
                                                >
                                                    <div
                                                        onClick={() => {
                                                            // setSelectedShadeIndex(index);
                                                            handleSelectedShadeData(product?.shade?.id, item?.id);
                                                        }}
                                                        className={`
                                                  
                                                    absolute top-0 left-0 w-full h-full flex justify-center items-center`}
                                                    >
                                                        <FaTimes className="text-white"/>
                                                    </div>
                                                    <div className=" w-full h-full">
                                                        <ImageURL image={product?.shade?.image} className={"object-fill w-full h-full"}/>
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        ) : product?.stock == 0 ? (
                                            <Tooltip placement="top" title={"Stock Out"}>
                                                <div
                                                    className={` rounded hover:cursor-pointer overflow-hidden relative ${
                                                        product?.shade?.id == selectedShade?.shade_id ? "shadow-[rgba(0,0,15,0.5)_0px_0px_2px_2px] border-[2px] border-white w-[37px] h-[37px]" : "w-9 h-9"
                                                    }`}
                                                >
                                                    <div
                                                        onClick={() => {
                                                            // setSelectedShadeIndex(index);
                                                            handleSelectedShadeData(product?.shade?.id, item?.id);
                                                        }}
                                                        className={`
                                              
                                                absolute top-0 left-0 w-full h-full flex justify-center items-center`}
                                                    >
                                                        <FaTimes className="text-white"/>
                                                    </div>
                                                    <div className=" w-full h-full">
                                                        <ImageURL image={product?.shade?.image} className={"object-fill w-full h-full"}/>
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        ) : (
                                            <div
                                                className={` rounded hover:cursor-pointer overflow-hidden relative ${
                                                    product?.shade?.id == selectedShade?.shade_id ? "shadow-[rgba(0,0,15,0.5)_0px_0px_2px_2px] border-[2px] border-white w-[37px] h-[37px]" : "w-9 h-9"
                                                }`}
                                            >
                                                <div
                                                    className={`${product?.shade?.id == selectedShade?.shade_id ? "block" : "hidden"} absolute top-0 left-0 w-full h-full flex justify-center items-center`}>
                                                    {/* bg-black bg-opacity-20 */}
                                                    <FaCheck className="text-white"/>
                                                </div>
                                                <div
                                                    className=" w-full h-full"
                                                    onClick={() => {
                                                        setSelectedShadeIndex(index);
                                                        handleSelectedShadeData(product?.shade?.id, item?.id);
                                                    }}
                                                >
                                                    <ImageURL image={product?.shade?.image} className={"object-fill w-full h-full"}/>
                                                </div>
                                            </div>
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5 className="text-center">{selectedShade?.shade?.name}</h5>
                        </div>
                        {selectedProduct?.discount_percent > 0 ? (
                            <div className="flex flex-wrap justify-center items-center gap-x-2 ">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="flex items-center text-lg font-semibold tracking-[-1.12px] leading-[42px]">৳{discountedPrice}</h2>
                                    <span className="flex flex-wrap items-center gap-2 font-medium">
                                        <h4 className="flex items-center text-sm font-semibold text-[#999] line-through">৳{mainPrice}</h4>
                                    </span>
                                </div>
                                <div className="border-[0.1px] h-4"></div>
                                <p className="whitespace-nowrap text-[#000000A6]  text-sm  leading-normal">
                                    <span className="text-[#02792A] font-semibold">(-{parseFloat(selectedProduct?.discount_percent).toFixed(0)}% Off)</span>
                                </p>
                            </div>
                        ) : (
                            <h2 className="text-center text-lg font-semibold tracking-[-1.12px] leading-[42px]">৳{mainPrice}</h2>
                        )}
                        {/* <div className="flex flex-wrap justify-center items-center gap-x-2 ">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="flex items-center text-lg font-semibold tracking-[-1.12px] leading-[42px]">৳550</h2>
                                <span className="flex flex-wrap items-center gap-2 font-medium">
                                    <h4 className="flex items-center text-sm font-semibold text-[#999] line-through">
                                        ৳{selectedShade?.shade_price}
                                    </h4>
                                </span>
                            </div>
                            <div className="border-[0.1px] h-4"></div>
                            <p className="whitespace-nowrap text-[#000000A6]  text-sm  leading-normal">
                                <span className="text-[#02792A] font-semibold">(-25% Off)</span>
                            </p>
                        </div> */}
                    </div>
                    {/* button area start */}
                    <div className="absolute w-full bottom-0">
                        {cartItemIsExist !== null ? (
                            <div className="bg-primary-color h-12 text-sm text-white flex items-center justify-center rounded-b-sm">
                                <p>Added To Bag</p>
                            </div>
                        ) : (
                            <>
                                {addToBagAnimation ? (
                                    <div className="bg-primary-color h-12 overflow-hidden">
                                        <div className="add-To-Bag-Animation mt-2">{cartShake ? <IoCartOutline size={30} className="text-white"/> :
                                            <IoCartSharp size={30} className="text-white"/>}</div>
                                    </div>
                                ) : (
                                    <div className="flex items-center w-full rounded-b-sm">
                                        <Link className="w-6/12" to={`/product-details/${item?.id}`}>
                                            <Button className=" text-sm py-[13px] w-full rounded-none font-medium text-primary-color rounded-bl-sm" variant="bordered">
                                                View Details
                                            </Button>
                                        </Link>
                                        <>
                                            {selectedProduct?.stock == 0 || selectedProduct?.stock === null ? (
                                                <>
                                                    {stockRequestIsLoading ? (
                                                        <Button className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm" variant="">
                                                            Requesting... 
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => {
                                                                handleRequestStock(selectedProduct);
                                                            }}
                                                            className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm"
                                                            variant=""
                                                        >
                                                            Request Stock
                                                        </Button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {addToCartIsLoading ? (
                                                        <Button className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm" variant="">
                                                            <Spin indicator={<LoadingOutlined style={{fontSize: 15}}/>}></Spin> <span className="ms-1">Add to Bag</span>
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            {getContactQuery?.data?.buy_status == 0 ? (
                                                                <Button
                                                                    // onClick={() => setAddToBagAnimation(true)}
                                                                    onClick={handleServiceOff}
                                                                    className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm"
                                                                    variant=""
                                                                >
                                                                    Add to Bag
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    // onClick={() => setAddToBagAnimation(true)}
                                                                    onClick={() => {
                                                                        handleAddToCart(selectedProduct);
                                                                    }}
                                                                    className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm"
                                                                    variant=""
                                                                >
                                                                    Add to Bag
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {/* button area end */}
                </div>
            )}
            {isPreviewSize && (
                <div className="absolute top-0 bg-white w-full h-full rounded z-10" style={{boxShadow: "0px 2px 6px 0px rgba(12, 107, 144, 0.06)"}}>
                    <div className="p-3 flex items-center justify-between border-b-[1px]">
                        <p>Select A Size({item?.product_sizes?.length})</p>
                        <Button onClick={() => setIsPreviewSize(false)} variant="ghost">
                            <IoClose size={20}/>
                        </Button>
                    </div>
                    <div className="flex flex-col justify-between ">
                        <div className="h-[246px] overflow-hidden overflow-y-auto slim-scroll mx-4 mt-2">
                            {[...item?.product_sizes]?.sort((a, b) => b.stock - a.stock)?.map((product, index) => (
                                <Fragment key={index}>
                                    {product?.stock == null ? (
                                        <div key={index} className="border-b-[1px] py-3">
                                            <label
                                                className="hover:cursor-pointer flex items-center gap-3 text-[#252728] font-inter text-sm font-normal leading-normal h-min "
                                                onClick={() => {
                                                    handleSelectedSizeData(product?.size?.id, item?.id);
                                                }}
                                            >
                                                <div className="relative flex items-center">
                                                    <input type="checkbox"
                                                           className={`rounded-full h-4 w-4 ${selectedCheckbox === product?.size?.name ? "bg-[#5DC9F4] text-white" : "bg-white"} border border-[#0094CF] appearance-none`}/>
                                                    <IoCloseSharp size={16} className="absolute top-0 text-white"/>
                                                </div>
                                                {product?.size?.name} {selectedCheckbox === product?.size?.name && <span>(Stock Out)</span>}
                                            </label>
                                        </div>
                                    ) : product?.stock == 0 ? (
                                        <div key={index} className="border-b-[1px] py-3">
                                            <label
                                                className="hover:cursor-pointer flex items-center gap-3 text-[#252728] font-inter text-sm font-normal leading-normal h-min "
                                                onClick={() => {
                                                    handleSelectedSizeData(product?.size?.id, item?.id);
                                                }}
                                            >
                                                <div className="relative flex items-center">
                                                    <input type="checkbox"
                                                           className={`rounded-full h-4 w-4 ${selectedCheckbox === product?.size?.name ? "bg-[#5DC9F4] text-white" : "bg-white"} border border-[#0094CF] appearance-none`}/>
                                                    <IoCloseSharp size={16} className="absolute top-0 text-white"/>
                                                </div>
                                                {product?.size?.name} {selectedCheckbox === product?.size?.name && <span>(Stock Out)</span>}
                                            </label>
                                        </div>
                                    ) : (
                                        <div key={index} className="border-b-[1px] py-3">
                                            <label
                                                className="hover:cursor-pointer flex items-center gap-3 text-[#252728] font-inter text-sm font-normal leading-normal h-min "
                                                // onClick={() => handleCheckboxChange(item?.size?.name)}
                                                onClick={() => {
                                                    handleCheckboxChange(product?.size?.name);
                                                    handleSelectedSizeData(product?.size?.id, item?.id);
                                                }}
                                            >
                                                <div className="relative flex items-center">
                                                    <input type="checkbox"
                                                           className={`rounded-full h-4 w-4 ${selectedCheckbox === product?.size?.name ? "bg-[#5DC9F4] text-white" : "bg-white"} border border-[#0094CF] appearance-none`}/>
                                                    <BsCheck size={16} className="absolute top-0 text-white"/>
                                                </div>
                                                {product?.size?.name}
                                            </label>
                                        </div>
                                    )}
                                </Fragment>
                            ))}
                            {/* <div className="flex justify-center flex-wrap ps-[6px] gap-2 ">
                                {shadeCount.map((item, index) => (
                                    <div className="w-7 h-7 bg-red-500 rounded hover:cursor-pointer" key={index}></div>
                                ))}
                            </div> */}
                        </div>

                        <div>
                            <p className="text-center">{selectedCheckbox}</p>
                        </div>
                        {selectedProduct?.discount_percent > 0 ? (
                            <div className="flex flex-wrap justify-center items-center gap-x-2 ">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="flex items-center text-lg font-semibold tracking-[-1.12px] leading-[42px]">৳{discountedPrice}</h2>
                                    <span className="flex flex-wrap items-center gap-2 font-medium">
                                        <h4 className="flex items-center text-sm font-semibold text-[#999] line-through">৳{mainPrice}</h4>
                                    </span>
                                </div>
                                <div className="border-[0.1px] h-4"></div>
                                <p className="whitespace-nowrap text-[#000000A6]  text-sm  leading-normal">
                                    <span className="text-[#02792A] font-semibold">(-{parseFloat(selectedProduct?.discount_percent).toFixed(0)}% Off)</span>
                                </p>
                            </div>
                        ) : (
                            <h2 className="text-center text-lg font-semibold tracking-[-1.12px] leading-[42px]">৳{mainPrice}</h2>
                        )}
                        {/* <div className="flex flex-wrap justify-center items-center gap-x-2 ">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="flex items-center text-lg font-semibold tracking-[-1.12px] leading-[42px]">৳550</h2>
                                <span className="flex flex-wrap items-center gap-2 font-medium">
                                    <h4 className="flex items-center text-sm font-semibold text-[#999] line-through">৳550</h4>
                                </span>
                            </div>
                            <div className="border-[0.1px] h-4"></div>
                            <p className="whitespace-nowrap text-[#000000A6]  text-sm  leading-normal">
                                <span className="text-[#02792A] font-semibold">(-25% Off)</span>
                            </p>
                        </div> */}
                    </div>
                    {/* button area start */}
                    <div className="absolute w-full bottom-0">
                        {cartItemIsExist !== null ? (
                            <div className="bg-primary-color h-12 text-sm text-white flex items-center justify-center rounded-b-sm">
                                <p>Added To Bag</p>
                            </div>
                        ) : (
                            <>
                                {addToBagAnimation ? (
                                    <div className="bg-primary-color h-12 overflow-hidden">
                                        <div className="add-To-Bag-Animation mt-2">{cartShake ? <IoCartOutline size={30} className="text-white"/> :
                                            <IoCartSharp size={30} className="text-white"/>}</div>
                                    </div>
                                ) : (
                                    <div className="flex items-center w-full rounded-b-sm">
                                        <Link className="w-6/12" to={`/product-details/${item?.id}`}>
                                            <Button className=" text-sm py-[13px] w-full rounded-none font-medium text-primary-color rounded-bl-sm" variant="bordered">
                                                View Details
                                            </Button>
                                        </Link>
                                        <>
                                            {selectedProduct?.stock == 0 || selectedProduct?.stock === null ? (
                                                <>
                                                    {stockRequestIsLoading ? (
                                                        <Button className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm" variant="">
                                                            Requesting...
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => {
                                                                handleRequestStock(selectedProduct);
                                                            }}
                                                            className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm"
                                                            variant=""
                                                        >
                                                            Request Stock
                                                        </Button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {addToCartIsLoading ? (
                                                        <Button className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm" variant="">
                                                            <Spin indicator={<LoadingOutlined style={{fontSize: 15}}/>}></Spin> <span className="ms-1">Add to Bag</span>
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            {getContactQuery?.data?.buy_status == 0 ? (
                                                                <Button
                                                                    // onClick={() => setAddToBagAnimation(true)}
                                                                    onClick={handleServiceOff}
                                                                    className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm"
                                                                    variant=""
                                                                >
                                                                    Add to Bag
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    // onClick={() => setAddToBagAnimation(true)}
                                                                    onClick={() => {
                                                                        handleAddToCart(selectedProduct);
                                                                    }}
                                                                    className=" text-sm w-6/12 font-medium py-[14px] rounded-none rounded-br-sm"
                                                                    variant=""
                                                                >
                                                                    Add to Bag
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {/* button area end */}
                </div>
            )}
        </div>
    );
};

export default CenterAlignCard;
