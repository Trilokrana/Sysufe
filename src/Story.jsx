import React, { useEffect, useState, useRef } from "react"; //import useRef for access to the input field

import { BiChevronDown } from "react-icons/bi";
import { BsPen, BsArrowLeft } from "react-icons/bs";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineStar } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";
import { RiShareFill } from "react-icons/ri";

import Popular from "./Popular";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import "./App.css";
import { ToastContainer, toast } from "react-toastify"; // import react-toastify
import "react-toastify/dist/ReactToastify.css"; // import styles

import SwiperCore, { EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/components/effect-coverflow/effect-coverflow.min.css";
SwiperCore.use([EffectCoverflow]);

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import CategoryPage from "./CategoryPage";

const appSetting = {
  databaseURL:
    "https://frontend-eefa8-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const List = ref(database, "List");

const cat = ref(database, "Category");

export default function Story() {
  const [initialCategories, setInitialCategories] = useState([
    "FIGMA",
    "FOOD",
    "ENGINEERING",
    "CINEMA",
    "JOURNALISM",
  ]);
  const [swiper, setSwiper] = useState(null);

  const [subject, setSubject] = useState("");
  const [describe, setDescribe] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [search, setSearch] = useState("");
  const [searchResults2, setSearchResults2] = useState([]);

  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState([]);
  const [randomCat, setRandom] = useState([]);
  const [mappable, setMappable] = useState([]);

  const [show, setShow] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [menu, setMenu] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [content, setContent] = useState(false);

  const [check, setCheck] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const [stories, setStories] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [reveal, setReveal] = useState({});

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [filteredStories, setFilteredStories] = useState([]); // add filterStories for search functionality

  const dropdownRef = useRef(null); //add reference to the Dropdown component
  const dropdownRef2 = useRef(null); //add reference to the Dropdown component

  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || [] // add local storage favorites here for star icons
  );
  const [showPopup, setShowPopup] = useState(false); // add a state variable for showing popup
  const [categoryUrl, setCategoryUrl] = useState(""); // add category url

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites)); //add useEffect  hook that saves favorites in local storage when trigger
  }, [favorites]);

  const toggleFavorite = (category) => {
    // add toogle for the star icon in each category
    if (favorites.includes(category)) {
      setFavorites(favorites.filter((fav) => fav !== category));
    } else {
      setFavorites([...favorites, category]);
    }
  };

  // add a function name for the share icon click event handler
  const shareCategory = (category) => {
    setShowPopup(true);
    const Url = `${window.location.origin}/${category.toLowerCase()}`;
    setCategoryUrl(Url);
  };
  
  const Copied_Url = () => {
    navigator.clipboard.writeText(categoryUrl);
    // add toast to show that url has been copied
    toast.info("Link copied ", {
      autoClose: 2000,
    });
  };

  useEffect(() => {
    onValue(cat, function (snapshot) {
      if (snapshot.exists()) {
        const entries = Object.entries(snapshot.val());
        setCategories(entries.map((item) => item[1]));
        setNewCat(entries.map((item) => item[1]));
        setRandom(entries.map((item) => item[1]));
      }
    });
  }, []);

  useEffect(() => {
    if (randomCat.length > 0) {
      const random = Math.floor(Math.random() * categories.length);
      setCheck(randomCat[random]);
    }
  }, [randomCat]);

  function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
  }

  function handleValue(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "subject") {
      setSubject(value);
    } else if (name === "description") {
      setDescribe(value);
    }
  }

  /*function handleSearch(e) {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    const results = performSearch(searchValue);
    setSearchResults(results);
  }*/

  // #Bug Fixed#
  // Update the handleSearch Function ,as in the above function , the searched text is not showing on screen .So I have added
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filteredCategories = initialCategories.filter((category) =>
      category.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(filteredCategories);
  };

  /*function handleSearch2(e) {   //this function is not working as intended .

    setSearch(e.target.value);
    setMenu(false);
    setShow3(true);
    
    const results = performSearch2(e.target.value);
    setSearchResults2(results);
  }*/

  // #Bug Fixed#
  //Update the handleSearch2 Function ,as in the above function , the searched text is not showing on screen .So I have added
  function handleSearch2(e) {
    const { value } = e.target;
    setSearch(value);
    setMenu(false);
    setShow3(true);
    if (value.trim() === "") {
      setFilteredStories([]); // Clear filtered stories if search value is empty
    } else {
      const filtered = stories.filter((story) =>
        story.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStories(filtered); // Update filtered stories based on search value
    }

    const filteredCategories = initialCategories.filter((category) =>
      category.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults2(filteredCategories);
  }

  function handleCategorySelect(category) {
    setSelectedCategory(category.toUpperCase());
    setSearchText("");
    setSearchResults([]);
    setShow(false);
  }

  function handleCategorySelect2(category) {
    setSelectedValue("");
    setSearch(category);
    setSearchResults2([]);
    searchBar(category);
  }

  function performSearch(searchValue) {
    const filteredCategories =
      categories &&
      categories.filter((category) =>
        category.toLowerCase().startsWith(searchValue.toLowerCase())
      );

    return filteredCategories;
  }

  function performSearch2(searchValue) {
    const filteredCategories =
      randomCat &&
      randomCat.filter((category) =>
        category.toLowerCase().startsWith(searchValue.toLowerCase())
      );

    return filteredCategories;
  }

  function clear() {
    setSubject("");
    setDescribe("");
    setSearchText("");
    setSelectedCategory("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const random = Math.random() * 4;
    const data = {
      subject: subject,
      description: describe,
      category: selectedCategory,
      timeStamp: getCurrentDateTime(),
      id: random,
    };
    {
      /* update the handle submit fucntion */
    }
    if (subject && describe && selectedCategory) {
      const newStory = {
        subject,
        description: describe,
        category: selectedCategory,
        timeStamp: getCurrentDateTime(),
      };
      setStories((currentStories) => [...currentStories, newStory]);
    }

    if (subject && describe && selectedCategory) {
      push(ref(database, `List/${selectedCategory}`), data);
      if (
        selectedCategory &&
        newCat &&
        !newCat.some(
          (item) => item.toLowerCase() === selectedCategory.toLowerCase()
        )
      ) {
        push(cat, selectedCategory);
      }
      // #Bug Fixed#
      // add toast notification here
      toast.success("Your story has been successfully posted!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      clear();
    }
  }

  function handleShow() {
    setShow((prev) => !prev);
  }

  function handleAdd() {
    setSelectedCategory(searchText.toUpperCase());
    setSearchText("");
    setSearchResults([]);
    setShow(false);

    if (searchText) {
      if (
        initialCategories &&
        !initialCategories.some(
          (item) => item.toLowerCase() === searchText.toLowerCase()
        )
      ) {
        setCategories((prevCategories) => [...prevCategories, searchText]);
        initialCategories.push(searchText);
      }
    }
  }

  function searchBar(cat) {
    cat && setMenu(true);
    setShow3(false);
    setShow4(false);
  }

  function handleClick() {
    setShow3((prev) => !prev);
    setShow4(false);
  }

  function handleClick2() {
    setShow4((prev) => !prev);
    setShow3(false);
  }
  //#Bug Fixed#
  //Handle click outside for the dropdown menu
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShow(false);
    }
  };
  //use useEffect to add event listener when component mounts and remove it when unmounting
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  //#Bug Fixed#
  //Handle click outside for the dropdown menu
  const handleClickOutside2 = (e) => {
    if (dropdownRef2.current && !dropdownRef2.current.contains(e.target)) {
      setShow4(false);
    }
  };
  //use useEffect to add event listener when component mounts and remove it when unmounting
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside2);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, [dropdownRef2]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    windowWidth > 425 ? setContent(true) : setContent(false);
  }, [windowWidth]);

  const handleFlip = () => {         // update handleFlip function 
    const newFlipped = !flipped;
    setFlipped(newFlipped); 

    const sortedInitialCategories = initialCategories.slice().sort((a, b) => {
      return newFlipped
        ? b.name.localeCompare(a.name) // Descending order
        : a.name.localeCompare(b.name); // Ascending order
    });
    // Update initialCategories with the newly sorted array
    setInitialCategories(sortedInitialCategories);

  
    if (searchResults2 && searchResults2.length > 0) {
      const sortedSearchResults = searchResults2.slice().sort((a, b) => {
        return newFlipped
          ? b.name.localeCompare(a.name) // Descending order
          : a.name.localeCompare(b.name); // Ascending order
      });
      // Update searchResults2 with the newly sorted array
      setSearchResults2(sortedSearchResults);
    }
  };

  function handleChildValue(value) {
    setSelectedValue(value);
    setSearch("");
  }

  function formattedDate(dateTimeString) {
    const dateTimeParts = dateTimeString.split("-");

    const day = dateTimeParts[0];
    const month = dateTimeParts[1];
    const year = dateTimeParts[2];

    return `${day}-${month}-${year}`;
  }

  function formattedDate2(dateTimeString) {
    const dateTimeParts = dateTimeString.split("-");

    const day = dateTimeParts[0];
    const month = dateTimeParts[1];
    const year = dateTimeParts[2];

    return `${month}-${day}-${year}`;
  }

  function formattedTime(dateTimeString) {
    const dateTimeParts = dateTimeString.split("-");

    const hours = dateTimeParts[3];
    const minutes = dateTimeParts[4];
    const seconds = dateTimeParts[5];

    return `${hours}-${minutes}-${seconds}`;
  }

  useEffect(() => {
    if (windowWidth > 425) {
      setReveal({});
    } else if (windowWidth <= 425) {
      setShow4(false);
      setShow(false);
    }
  }, [windowWidth]);

  function togglePara(itemId) {
    windowWidth > 425
      ? setExpandedSections((prevExpandedSections) => ({
          ...prevExpandedSections,
          [itemId]: !prevExpandedSections[itemId],
        }))
      : setReveal((prevReveal) => ({
          ...prevReveal,
          [itemId]: !prevReveal[itemId],
        }));
  }

  const revealMain = {
    position: "absolute",
    top: "0px",
    left: windowWidth > 375 ? "-75px" : windowWidth > 320 ? "-90px" : "-80px",
    width: windowWidth > 320 ? "283px" : "250px",
    height: "257px",
    boxShadow: "1px 1px 0px #000000",
  };

  const revealhead = {
    alignSelf: "center",
    width: "194px",
    marginBottom: "8px",
  };

  const revealPara = {
    marginTop: "initial",
    width: "215px",
    overflowY: reveal ? "auto" : "hidden",
    maxHeight: "112px",
    fontSize: "0.625rem",
  };

  function goback() {
    setReveal({});
  }

  useEffect(() => {
    if (selectedValue) {
      onValue(
        ref(database, `List/${selectedValue.toUpperCase()}`),
        function (snapshot) {
          if (snapshot.exists()) {
            setStories(Object.entries(snapshot.val()).length);
            setMappable(Object.entries(snapshot.val()));
          }
        }
      );
    }
    setReveal({});
  }, [selectedValue]);

  useEffect(() => {
    if (check) {
      onValue(
        ref(database, `List/${check.toUpperCase()}`),
        function (snapshot) {
          if (snapshot.exists()) {
            setStories(Object.entries(snapshot.val()).length);
            setMappable(Object.entries(snapshot.val()));
          }
        }
      );
    }

    setReveal({});
  }, [check]);

  useEffect(() => {
    if (search) {
      onValue(
        ref(database, `List/${search.toUpperCase()}`),
        function (snapshot) {
          if (snapshot.exists()) {
            setStories(Object.entries(snapshot.val()).length);
            setMappable(Object.entries(snapshot.val()));
          }
        }
      );
    }
    setReveal({});
  }, [search]);

  function showContent() {
    setContent((prev) => !prev);
  }

  function paragraph(item) {
    if (item) {
      const words = item[1].split(" ");
      const isExpanded = expandedSections[item[2]];
      const isRevealed = reveal[item[2]];

      if (words.length > 24 && !isExpanded) {
        return (
          <div
            className="item-section"
            key={item[2]}
            style={isRevealed ? revealMain : {}}
          >
            <div className="item-category">
              <h3>{item[0]}</h3>
              <p>{formattedDate(item[4])}</p>
            </div>
            {isRevealed && (
              <BsArrowLeft className="left-arrow" onClick={goback} />
            )}
            <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
            <div className="show-para">
              {isRevealed ? (
                <p style={isRevealed ? revealPara : {}}>
                  {item[1].slice(0, item[1].length)}...
                </p>
              ) : (
                <p>{item[1].slice(0, 154)}...</p>
              )}
            </div>
            {windowWidth > 425 ? (
              <span className="read-more" onClick={() => togglePara([item[2]])}>
                Read more...
              </span>
            ) : (
              !isRevealed && (
                <span
                  className="read-more"
                  onClick={() => togglePara([item[2]])}
                >
                  Read more...
                </span>
              )
            )}
          </div>
        );
      } else {
        return (
          <div
            className="item-section"
            key={item[2]}
            style={isRevealed ? revealMain : {}}
          >
            <div className="item-category">
              <h3>{item[0]}</h3>
              <p>{formattedDate(item[4])}</p>
            </div>
            {isRevealed && (
              <BsArrowLeft className="left-arrow" onClick={goback} />
            )}
            <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
            <div className="show-para">
              <p style={isRevealed ? revealPara : {}}>{item[1]}</p>
            </div>
            {words.length > 24 && windowWidth > 425 ? (
              <span className="read-more" onClick={() => togglePara(item[2])}>
                Read less
              </span>
            ) : (
              words.length > 24 &&
              !isRevealed && (
                <span className="read-more" onClick={() => togglePara(item[2])}>
                  Read more...
                </span>
              )
            )}
          </div>
        );
      }
    }
  }

  function sorted(mappable) {
    const sortedMappable = mappable.sort((a, b) => {
      const dateA = new Date(formattedDate2(Object.values(a[1])[4]));
      const dateB = new Date(formattedDate2(Object.values(b[1])[4]));

      if (dateA < dateB) {
        return flipped ? 1 : -1;
      }

      if (dateA > dateB) {
        return flipped ? -1 : 1;
      }

      const timeA = formattedTime(Object.values(a[1])[4]);
      const timeB = formattedTime(Object.values(b[1])[4]);

      if (timeA < timeB) {
        return flipped ? 1 : -1;
      }
      if (timeA > timeB) {
        return flipped ? -1 : 1;
      }
    });

    return sortedMappable.map((items, index) => {
      const random = Math.random() * 4;
      return (
        <div key={random} className="single-items">
          {paragraph(Object.values(items[1]))}
        </div>
      );
    });
  }

  return (
    //#Bug Fixed# // add Toast Containter here .
    <Router>
      <div className="flex">
        <ToastContainer />

        <Popular onChildValue={handleChildValue} />
        <div className="story-section">
          <form className="section-1">
            <div className="section-1-head">
              <h1>Write your own story</h1>
              <BsPen className="pen" onClick={showContent} />
            </div>
            {content && (
              <div className="section-1-content">
                <div className="subject">
                  <label htmlFor="subject">
                    <h3>Topic</h3>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="write the topic for your story "
                    value={subject}
                    onChange={(e) => handleValue(e)}
                    required
                  />
                </div>

                <div className="description">
                  <label htmlFor="describe">
                    <h3>Description</h3>
                  </label>
                  <textarea
                    value={describe}
                    name="description"
                    id="describe"
                    placeholder="write what your story is about here"
                    onChange={(e) => handleValue(e)}
                    required
                  />
                </div>

                <div className="selectCategory" ref={dropdownRef}>
                  <div className="select-btn" onClick={handleShow}>
                    {selectedCategory ? (
                      <span>{selectedCategory.toUpperCase()}</span>
                    ) : (
                      <span>Select a category</span>
                    )}
                    <BiChevronDown className="down" />
                  </div>

                  {show && (
                    <div className="content">
                      <div className="search">
                        <AiOutlineSearch className="search-btn" />
                        <input
                          type="search" // change type here from "text" to "search" if you want to use it as a real search
                          id="category"
                          placeholder="Search"
                          value={searchText}
                          onChange={handleSearch}
                          required
                        />
                      </div>

                      {searchText.length === 0 ? (
                        <ul className="search-list">
                          {initialCategories.map((category) => (
                            <li
                              key={category}
                              onClick={() => handleCategorySelect(category)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      ) : searchResults.length > 0 ? (
                        <ul className="search-list">
                          {searchResults.map((category) => (
                            <li
                              key={category}
                              onClick={() => handleCategorySelect(category)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="search-list">
                          <li onClick={handleAdd}>Add new category</li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-btn "
                  onClick={handleSubmit}
                >
                  PUBLISH YOUR STORY
                </button>
              </div>
            )}
          </form>

          <div className="middle-line" />

          <section className="section-2">
            <div className="section-2-head">
              <div className="section-2-head">
                <h1>
                  {favorites.length > 0 ? "Favorite Topics" : "Popular Topics"}
                </h1>
              </div>
              <h1>Read stories on </h1>

              <div className="looking">
                <div className="choose">
                  <label htmlFor="choose">
                    <h3>What are you looking for?</h3>
                  </label>
                  <input
                    type="search"   // "text" to "search" , add a search bar to filter the topics by keyword
                    id="choose"
                    placeholder="Browse a Category"
                    value={search}
                    onClick={() => setShow4(!show4)}
                    onChange={(e) => {
                      handleSearch2(e);
                    }}
                    required
                  />
                  <BiChevronDown
                    className="btn-2"
                    onClick={() => setShow4(!show4)}
                  />
                </div>
                {show4 ? (
                  <ul className="search-list search-list-2" ref={dropdownRef2}>
                    <li
                      onClick={handleFlip}
                      className="fs-8 bg-slate-50"
                      style={{ display: "flex", gap: "10px" }}
                    >
                      <span className="popular-topics">
                        <div>
                          {favorites.includes() ? (
                            <AiFillStar
                              size={23}
                              onClick={() => toggleFavorite()}
                              style={{ color: "gold" }}
                            />
                          ) : (
                            <AiOutlineStar
                              size={23}
                              onClick={() => toggleFavorite()}
                            />
                          )}
                        </div>
                      </span>
                      {/*set the sort under the dropdown menu */}
                      Sort: {flipped ? `Newest to Oldest` : `Oldest to Newest`}
                    </li>
                    {search.length === 0   // add a search  bar for all categories here 
                      ? initialCategories?.map((category) => (
                          <li
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                            key={category}
                          >
                            <Link
                              to={`/category/${category}`}
                              style={{
                                color: "white",
                                textDecoration: "none",
                              }}
                            >
                              <div
                                style={{
                                  width: "70%",
                                }}
                                onClick={() => handleCategorySelect2(category)}
                              >
                                {category}
                              </div>
                            </Link>
                            <span>
                              {favorites.includes(category) ? (
                                <span> 
                                  <AiFillStar   // add a star icon when the category is favorited
                                    size={23}
                                    onClick={() => toggleFavorite(category)}
                                    style={{
                                      color: "gold",
                                      marginRight: "15px",
                                    }}
                                  />
                                  <span>
                                    <RiShareFill    //add a share icon here for sharing favorite category
                                      size={23}
                                      onClick={() => shareCategory(category)} // share the link of this category
                                      style={{ cursor: "pointer" }}
                                    />

                                    {/* Popup */}
                                    {showPopup && (
                                      <div
                                        style={{
                                          width: "auto",
                                          height: "150px",
                                          position: "fixed",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          backgroundColor: "white",
                                          padding: "20px",
                                          border: "1px solid #ccc",
                                          borderRadius: "8px",
                                          boxShadow:
                                            "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          zIndex: "9999",
                                        }}
                                      >
                                        <p>Category URL</p>
                                        <p
                                          style={{
                                            marginBottom: "18px",
                                            marginTop: "20px",
                                            color: "blue",
                                            transform: "",
                                          }}
                                        >
                                          {categoryUrl}
                                        </p>
                                        <button
                                          onClick={() => setShowPopup(false)} // add a show pop up function here
                                          style={{
                                            marginRight: "10px", // Add a gap between the buttons
                                            padding: "8px 16px", // Adjust padding for better appearance
                                            borderRadius: "20px", // Make the button rounded
                                            border: "none", // Remove border
                                            backgroundColor: "#ccc", // Add background color
                                            cursor: "pointer", // Change cursor on hover
                                          }}
                                        >
                                          Close
                                        </button>
                                        <button
                                          onClick={Copied_Url}
                                          style={{
                                            padding: "8px 16px", // Adjust padding for better appearance
                                            borderRadius: "20px", // Make the button rounded
                                            border: "none", // Remove border
                                            backgroundColor: "#007bff", // Add background color
                                            color: "white", // Change text color
                                            cursor: "pointer", // Change cursor on hover
                                          }}
                                        >
                                          Copy
                                        </button>
                                      </div>
                                    )}
                                  </span>
                                </span>
                              ) : (
                                <AiOutlineStar
                                  size={23}
                                  onClick={() => toggleFavorite(category)}
                                />
                              )}
                            </span>
                          </li>
                        ))
                      : searchResults2.map((category) => (
                          <li
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                            key={category}
                          >
                            <Link
                              to={`/category/${category}`}
                              style={{
                                color: "white",
                                textDecoration: "none",
                              }}
                            >
                              <div
                                onClick={() => handleCategorySelect2(category)}
                              >
                                {category}
                              </div>
                            </Link>
                            <span>
                              {favorites.includes(category) ? (
                                <AiFillStar
                                  size={23}
                                  onClick={() => toggleFavorite(category)}
                                  style={{ color: "gold" }}
                                />
                              ) : (
                                <AiOutlineStar
                                  size={23}
                                  onClick={() => toggleFavorite(category)}
                                />
                              )}
                            </span>
                          </li>
                        ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {/* add the features Show the submiited form data on to the screen  */}
            <div
              className="storyBox"
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                maxHeight: "600px",
                overflowY: "scroll",
              }}
            >
              <div className="storyContainer">
                {stories.map((story, index) => (
                  <div
                    key={index}
                    className="story"
                    style={{
                      marginBottom: "20px",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <h2>Topic:{story.subject}</h2>
                      <p>Category: {story.category}</p>
                      <p>Submitted at: {story.timeStamp}</p>
                    </div>
                    <div
                      style={{
                        overflow: "hidden",
                        height: expandedSections[index] ? "auto" : "80px",
                      }}
                    >
                      <p>Description:{story.description}</p>
                    </div>
                    {story.description.length > 10 ? (
                      <button onClick={() => togglePara(index)}>
                        {expandedSections[index] ? "Show less" : "Show more"}{" "}
                        {/*#Bug Fixed
                      Box size of each story is fixed here  */}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {/* #Bug Fixed
            Show No stories found for the categories where stories are not there
             */}
            {filteredStories.length === 0 ? (
              <p style={{ fontStyle: "italic" }}>No stories found</p>
            ) : (
              filteredStories.map((story, index) => (
                <div
                  key={index}
                  className="story"
                  style={{
                    marginBottom: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                ></div>
              ))
            )}

            {windowWidth > 425 ? (
              <div>
                {selectedValue && (
                  <div className="container">
                    <section className="item-section-main">
                      <div className="item-section-container">
                        {check && mappable && sorted(mappable)}
                      </div>
                    </section>
                  </div>
                )}

                {(!menu || search.length === 0) && (
                  <div className="container">
                    <section className="item-section-main">
                      <div className="item-section-container">
                        {check && mappable && sorted(mappable)}
                      </div>
                    </section>
                  </div>
                )}

                {search.length > 0 && menu && (
                  <div className="container">
                    <section className="item-section-main">
                      <div className="item-section-container">
                        {sorted(mappable)}
                      </div>
                    </section>
                  </div>
                )}
              </div>
            ) : (
              <div className="container">
                <section className="item-section-main">
                  <Swiper
                    effect="coverflow"
                    // grabCursor='true'
                    centeredSlides="true"
                    slidesPerView={3}
                    coverflowEffect={{
                      rotate: 0,
                      stretch: 0,
                      depth: 200,
                      modifier: 1,
                      slideShadows: false,
                    }}
                    // onSwiper={handleSwiperInit}
                    // onSlideChange={handleSlideChange}
                  >
                    <div className="swiper-wrapper">
                      {(() => {
                        const sortedMappable = mappable.sort((a, b) => {
                          const dateA = new Date(
                            formattedDate2(Object.values(a[1])[4])
                          );
                          const dateB = new Date(
                            formattedDate2(Object.values(b[1])[4])
                          );

                          if (dateA < dateB) {
                            return flipped ? 1 : -1;
                          }

                          if (dateA > dateB) {
                            return flipped ? -1 : 1;
                          }

                          const timeA = formattedTime(Object.values(a[1])[4]);
                          const timeB = formattedTime(Object.values(b[1])[4]);

                          if (timeA < timeB) {
                            return flipped ? 1 : -1;
                          }
                          if (timeA > timeB) {
                            return flipped ? -1 : 1;
                          }
                        });

                        return sortedMappable.map((items, index) => {
                          const random = Math.random() * 4;
                          return (
                            <SwiperSlide key={random} className="swiper-slide">
                              {paragraph(Object.values(items[1]))}
                            </SwiperSlide>
                          );
                        });
                      })()}
                    </div>
                  </Swiper>
                </section>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Define routes for each category */}
      <Routes>
        <Route path="/category/:categoryName" component={<CategoryPage />} />
      </Routes>
    </Router>
  );
}
