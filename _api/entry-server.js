var _a;
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { createContext, useState, useEffect, useContext, useRef, useCallback, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { useLocation, useNavigate, Link, useParams, Navigate, Outlet, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone, User, Settings, LogOut, LogIn, X, Menu, ChevronLeft, ChevronRight, BookOpen, FileText, Newspaper, Star, ChevronUp, Mail, Clock, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowLeft, ArrowRight, Filter, Calendar, CheckCircle, XCircle, AlertCircle, Check, ShoppingCart, CalendarDays, Award, Users, RefreshCw, Shield, LayoutDashboard, Tag, FileEdit, Image, Type, GraduationCap, MessageSquare, BarChart, ClipboardCheck, FileQuestion, PlusCircle, Edit, Trash2, Save, Plus, Download, Search, ArrowUp, ArrowDown, EyeOff, Eye, Globe, FilePlus, Trash, FolderPlus, Minus, Loader, Upload, Link as Link$1, MessageCircle, Edit2 } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, query, collection, orderBy, getDocs, updateDoc, addDoc, deleteDoc, writeBatch, Timestamp, serverTimestamp, where, FirestoreError, limit } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { format } from "date-fns";
import slugify from "slugify";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";
import { $getRoot, $createParagraphNode, $createTextNode, CAN_UNDO_COMMAND, CAN_REDO_COMMAND, $getSelection, $isRangeSelection, UNDO_COMMAND, REDO_COMMAND, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { CodeNode, CodeHighlightNode, $createCodeNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { TRANSFORMERS } from "@lexical/markdown";
import { $getSelectionStyleValueForProperty, $setBlocksType, $patchStyleText } from "@lexical/selection";
import { getApps, initializeApp as initializeApp$1, cert } from "firebase-admin/app";
import { getFirestore as getFirestore$1 } from "firebase-admin/firestore";
import dotenv from "dotenv";
const firebaseConfig = {
  apiKey: "AIzaSyBF0X_DhWmiMI5hQ89_SeQ5k_OCKyVug20",
  authDomain: "epitome-ias.firebaseapp.com",
  projectId: "epitome-ias",
  storageBucket: "epitome-ias.firebasestorage.app",
  messagingSenderId: "467645331255",
  appId: "1:467645331255:web:9a42bc08ee98eace2fccb2"
};
console.log("Firebase Config Debug:", {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  projectId: firebaseConfig.projectId,
  // Safe to log
  authDomain: firebaseConfig.authDomain
  // Safe to log
});
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth$1 = getAuth(app);
const storage$1 = getStorage(app);
const LoadingScreen = () => {
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 bg-white flex flex-col items-center justify-center z-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-24 h-24 md:w-32 md:h-32 relative mb-6", children: [
      /* @__PURE__ */ jsx(
        motion.img,
        {
          src: "https://i.postimg.cc/qMYWSV1h/Untitled-design-12.png",
          alt: "Epitome IAS Logo",
          className: "w-full h-full object-contain",
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5 }
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute inset-0 border-4 border-transparent border-t-[var(--primary-blue)] border-r-[var(--primary-red)] rounded-full",
          animate: { rotate: 360 },
          transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      motion.h2,
      {
        className: "text-lg md:text-xl text-gray-700 font-medium",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.3 },
        children: "Loading amazing content..."
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "mt-4 flex space-x-2",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.6 },
        children: [
          /* @__PURE__ */ jsx("span", { className: "w-3 h-3 bg-[var(--primary-blue)] rounded-full animate-bounce", style: { animationDelay: "0ms" } }),
          /* @__PURE__ */ jsx("span", { className: "w-3 h-3 bg-[var(--primary-red)] rounded-full animate-bounce", style: { animationDelay: "150ms" } }),
          /* @__PURE__ */ jsx("span", { className: "w-3 h-3 bg-[var(--primary-blue)] rounded-full animate-bounce", style: { animationDelay: "300ms" } })
        ]
      }
    )
  ] });
};
const AuthContext = createContext(null);
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const checkAdminStatus = async (user2) => {
    try {
      const userRef = doc(db, "admins", user2.uid);
      const userDoc = await getDoc(userRef);
      return userDoc.exists();
    } catch (error2) {
      console.error("Error checking admin status:", error2);
      return false;
    }
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!isClient) return;
    const unsubscribe = onAuthStateChanged(
      auth$1,
      async (user2) => {
        setUser(user2);
        if (user2) {
          const adminStatus = await checkAdminStatus(user2);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      },
      (error2) => {
        console.error("Auth state change error:", error2);
        setError(error2.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isClient]);
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth$1, email, password);
      const adminStatus = await checkAdminStatus(userCredential.user);
      if (!adminStatus) {
        await signOut(auth$1);
        throw new Error("You do not have admin privileges");
      }
      setIsAdmin(true);
    } catch (error2) {
      console.error("Sign in error:", error2);
      if (error2 instanceof Error) {
        setError(error2.message);
      } else {
        setError("An unknown error occurred during sign in");
      }
      throw error2;
    }
  };
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth$1, provider);
      const user2 = result.user;
      const details = getAdditionalUserInfo(result);
      if (details == null ? void 0 : details.isNewUser) {
        await setDoc(doc(db, "users", user2.uid), {
          uid: user2.uid,
          email: user2.email,
          displayName: user2.displayName,
          photoURL: user2.photoURL,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
      const adminStatus = await checkAdminStatus(user2);
      setIsAdmin(adminStatus);
    } catch (error2) {
      console.error("Google sign in error:", error2);
      if (error2 instanceof Error) {
        setError(error2.message);
      } else {
        setError("An unknown error occurred during Google sign in");
      }
      throw error2;
    }
  };
  const signOut$1 = async () => {
    try {
      setError(null);
      await signOut(auth$1);
      setIsAdmin(false);
    } catch (error2) {
      console.error("Sign out error:", error2);
      if (error2 instanceof Error) {
        setError(error2.message);
      } else {
        setError("An unknown error occurred during sign out");
      }
      throw error2;
    }
  };
  const value = {
    user,
    loading,
    error,
    isAdmin,
    signInWithEmail,
    signInWithGoogle,
    signOut: signOut$1
  };
  if (loading && isClient) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
};
const Navbar = () => {
  var _a2;
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut: signOut2 } = useAuth();
  useEffect(() => {
    const storedPendingScroll = sessionStorage.getItem("pendingScroll");
    const currentPendingScroll = pendingScroll || storedPendingScroll;
    if (currentPendingScroll && location.pathname === "/") {
      const element = document.getElementById(currentPendingScroll);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          setPendingScroll(null);
          sessionStorage.removeItem("pendingScroll");
        }, 1e3);
      }
    } else if (location.pathname !== "/") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, pendingScroll]);
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const menuItems = [
    { title: "Courses", href: "/courses" },
    { title: "Blogs", href: "/blogs" },
    {
      title: "Current Affairs",
      href: "/current-affairs",
      hasDropdown: true,
      dropdownItems: [
        { title: "UPSC", href: "/current-affairs/upsc" },
        { title: "TGPSC", href: "/current-affairs/tgpsc" },
        { title: "APPSC", href: "/current-affairs/appsc" }
      ]
    }
  ];
  const dropdownItems = [
    {
      title: "UPSC",
      items: [
        { title: "Syllabus", href: "/upsc-syllabus" },
        { title: "UPSC Notes", href: "/upsc-notes" },
        {
          title: "PYQs",
          href: "#",
          subItems: [
            { title: "Prelims", href: "/pyqs/prelims/upsc" },
            { title: "Mains", href: "/upsc-mains-pyqs" }
          ]
        },
        {
          title: "Practice",
          href: "#",
          subItems: [
            { title: "Prelims", href: "/prelims-practice" },
            { title: "Mains", href: "/mains-practice" }
          ]
        }
      ]
    },
    {
      title: "TGPSC",
      items: [
        { title: "Syllabus", href: "/tgpsc-syllabus" },
        { title: "TGPSC Notes", href: "/tgpsc-notes" },
        {
          title: "PYQs",
          href: "#",
          subItems: [
            { title: "Prelims", href: "/pyqs/prelims/tgpsc" },
            { title: "Mains", href: "/tgpsc-mains-pyqs" }
          ]
        },
        {
          title: "Practice",
          href: "#",
          subItems: [
            { title: "Prelims", href: "/tgpsc-prelims-practice" },
            { title: "Mains", href: "/tgpsc-mains-practice" }
          ]
        }
      ]
    },
    {
      title: "APPSC",
      items: [
        { title: "Syllabus", href: "/appsc-syllabus" },
        { title: "APPSC Notes", href: "/appsc-notes" },
        {
          title: "PYQs",
          href: "#",
          subItems: [
            { title: "Prelims", href: "/pyqs/prelims/appsc" },
            { title: "Mains", href: "/appsc-mains-pyqs" }
          ]
        },
        {
          title: "Practice",
          href: "#",
          subItems: [
            { title: "Prelims", href: "/appsc-prelims-practice" },
            { title: "Mains", href: "/appsc-mains-practice" }
          ]
        }
      ]
    }
  ];
  const handleNavigation = (href) => {
    if (href.includes("-notes")) {
      window.location.href = href;
      return;
    }
    if (href.startsWith("/#")) {
      const sectionId = href.substring(2);
      if (location.pathname !== "/") {
        setPendingScroll(sectionId);
        sessionStorage.setItem("pendingScroll", sectionId);
        navigate("/");
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      navigate(href);
      window.scrollTo(0, 0);
    }
    setIsOpen(false);
    setUserMenuOpen(false);
    setActiveDropdown(null);
  };
  const handleDropdownToggle = (e, title) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === title ? null : title);
    setActiveSubMenu(null);
  };
  const handleSubMenuToggle = (e, title) => {
    e.stopPropagation();
    setActiveSubMenu(activeSubMenu === title ? null : title);
  };
  const toggleMobileDropdown = (key) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleSignOut = async () => {
    try {
      await signOut2();
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return /* @__PURE__ */ jsx("nav", { className: "bg-white shadow-lg fixed w-full z-50", children: /* @__PURE__ */ jsxs("div", { className: "container-custom", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-16", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx("button", { onClick: () => handleNavigation("/"), className: "focus:outline-none", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://i.postimg.cc/qMYWSV1h/Untitled-design-12.png",
          alt: "UPSC Guide Logo",
          className: "h-12 w-auto"
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center space-x-8", children: [
        dropdownItems.map((dropdown) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: (e) => handleDropdownToggle(e, dropdown.title),
                  className: "flex items-center space-x-1 nav-link",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: dropdown.title }),
                    /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" })
                  ]
                }
              ),
              activeDropdown === dropdown.title && /* @__PURE__ */ jsx("div", { className: "absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-60", children: dropdown.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: (e) => item.subItems ? handleSubMenuToggle(e, `${dropdown.title}-${item.title}`) : handleNavigation(item.href),
                    className: "flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                    children: [
                      /* @__PURE__ */ jsx("span", { children: item.title }),
                      item.subItems && /* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3 ml-2" })
                    ]
                  }
                ),
                item.subItems && /* @__PURE__ */ jsx("div", { className: "absolute left-full top-0 w-40 bg-white rounded-md shadow-lg py-1 z-60 hidden md:group-hover:block", children: item.subItems.map((subItem) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleNavigation(subItem.href),
                    className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                    children: subItem.title
                  },
                  subItem.title
                )) }),
                item.subItems && activeSubMenu === `${dropdown.title}-${item.title}` && /* @__PURE__ */ jsx("div", { className: "md:hidden w-full bg-gray-50 py-1 pl-4 border-l-2 border-blue-500", children: item.subItems.map((subItem) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleNavigation(subItem.href),
                    className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                    children: subItem.title
                  },
                  subItem.title
                )) })
              ] }, item.title)) })
            ]
          },
          dropdown.title
        )),
        menuItems.map((item) => {
          var _a3;
          return item.hasDropdown ? /* @__PURE__ */ jsxs("div", { className: "relative inline-block text-left", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: (e) => handleDropdownToggle(e, item.title),
                className: `nav-link flex items-center ${location.pathname.includes(item.href) ? "text-blue-600" : ""}`,
                children: [
                  item.title,
                  /* @__PURE__ */ jsx(ChevronDown, { className: "ml-1 h-4 w-4" })
                ]
              }
            ),
            activeDropdown === item.title && /* @__PURE__ */ jsx("div", { className: "absolute z-60 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5", children: /* @__PURE__ */ jsx("div", { className: "py-1", role: "menu", "aria-orientation": "vertical", children: (_a3 = item.dropdownItems) == null ? void 0 : _a3.map((dropdownItem) => /* @__PURE__ */ jsx(
              Link,
              {
                to: dropdownItem.href,
                className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                role: "menuitem",
                onClick: () => setActiveDropdown(null),
                children: dropdownItem.title
              },
              dropdownItem.title
            )) }) })
          ] }, item.title) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleNavigation(item.href),
              className: `nav-link ${location.pathname === item.href ? "text-blue-600" : ""}`,
              children: item.title
            },
            item.title
          );
        }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "tel:+919876543210",
            className: "flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300",
            children: [
              /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 mr-2" }),
              "Let's Talk"
            ]
          }
        ),
        user ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setUserMenuOpen(!userMenuOpen),
              className: "flex items-center space-x-2 focus:outline-none",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white", children: user.photoURL ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: user.photoURL,
                    alt: user.displayName || "User",
                    className: "w-8 h-8 rounded-full"
                  }
                ) : /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: ((_a2 = user.displayName) == null ? void 0 : _a2.split(" ")[0]) || "User" })
              ]
            }
          ),
          userMenuOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-60", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleNavigation("/profile"),
                className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                children: [
                  /* @__PURE__ */ jsx(User, { className: "w-4 h-4 inline mr-2" }),
                  "Your Profile"
                ]
              }
            ),
            isAdmin && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleNavigation("/admin"),
                className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                children: [
                  /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 inline mr-2" }),
                  "Admin Panel"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleSignOut,
                className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 inline mr-2" }),
                  "Sign out"
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => handleNavigation("/login"), className: "flex items-center btn-primary", children: [
          /* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4 mr-2" }),
          "Sign in"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(!isOpen), className: "p-2", children: isOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" }) }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        className: "md:hidden",
        children: /* @__PURE__ */ jsxs("div", { className: "px-2 pt-2 pb-3 space-y-1", children: [
          dropdownItems.map((dropdown) => /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => toggleMobileDropdown(dropdown.title),
                className: "flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-base nav-link",
                children: [
                  /* @__PURE__ */ jsx("span", { children: dropdown.title }),
                  /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${mobileDropdowns[dropdown.title] ? "rotate-180" : ""}` })
                ]
              }
            ),
            mobileDropdowns[dropdown.title] && /* @__PURE__ */ jsx("div", { className: "pl-4 mt-1 space-y-1 border-l-2 border-blue-200", children: dropdown.items.map((item) => /* @__PURE__ */ jsx("div", { children: item.subItems ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => toggleMobileDropdown(`${dropdown.title}-${item.title}`),
                  className: "flex items-center justify-between w-full text-left px-3 py-2 text-sm nav-link",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: item.title }),
                    /* @__PURE__ */ jsx(ChevronDown, { className: `w-3 h-3 transition-transform ${mobileDropdowns[`${dropdown.title}-${item.title}`] ? "rotate-180" : ""}` })
                  ]
                }
              ),
              mobileDropdowns[`${dropdown.title}-${item.title}`] && /* @__PURE__ */ jsx("div", { className: "pl-4 mt-1 space-y-1 border-l-2 border-blue-100", children: item.subItems.map((subItem) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleNavigation(subItem.href),
                  className: "block w-full text-left px-3 py-2 text-xs nav-link",
                  children: subItem.title
                },
                subItem.title
              )) })
            ] }) : /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleNavigation(item.href),
                className: "flex items-center w-full text-left px-3 py-2 text-sm nav-link",
                children: /* @__PURE__ */ jsx("span", { children: item.title })
              }
            ) }, item.title)) })
          ] }, dropdown.title)),
          menuItems.map((item) => {
            var _a3;
            return item.hasDropdown ? /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: (e) => handleDropdownToggle(e, item.title),
                  className: `flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-base nav-link ${location.pathname.includes(item.href) ? "text-blue-600" : ""}`,
                  children: [
                    item.title,
                    /* @__PURE__ */ jsx(ChevronDown, { className: "ml-1 h-4 w-4" })
                  ]
                }
              ),
              activeDropdown === item.title && /* @__PURE__ */ jsx("div", { className: "pl-4 mt-1 space-y-1", children: (_a3 = item.dropdownItems) == null ? void 0 : _a3.map((dropdownItem) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    handleNavigation(dropdownItem.href);
                    setActiveDropdown(null);
                  },
                  className: "block w-full text-left px-3 py-2 text-sm nav-link",
                  children: dropdownItem.title
                },
                dropdownItem.title
              )) })
            ] }, item.title) : /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleNavigation(item.href),
                className: `block w-full text-left px-3 py-2 rounded-md text-base nav-link ${location.pathname === item.href ? "text-blue-600" : ""}`,
                children: item.title
              },
              item.title
            );
          }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "tel:+919876543210",
              className: "flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300 w-full mt-2",
              children: [
                /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 mr-2" }),
                "Let's Talk"
              ]
            }
          ),
          user ? /* @__PURE__ */ jsxs("div", { className: "mt-4 border-t pt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center px-3 py-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2", children: user.photoURL ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: user.photoURL,
                  alt: user.displayName || "User",
                  className: "w-8 h-8 rounded-full"
                }
              ) : /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: user.displayName || user.email })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleNavigation("/profile"),
                className: "flex items-center w-full text-left px-3 py-2 text-base nav-link",
                children: [
                  /* @__PURE__ */ jsx(User, { className: "w-4 h-4 mr-2" }),
                  "Your Profile"
                ]
              }
            ),
            isAdmin && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleNavigation("/admin"),
                className: "flex items-center w-full text-left px-3 py-2 text-base nav-link",
                children: [
                  /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 mr-2" }),
                  "Admin Panel"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleSignOut,
                className: "flex items-center w-full text-left px-3 py-2 text-base nav-link",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 mr-2" }),
                  "Sign out"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleNavigation("/login"),
              className: "flex items-center btn-primary w-full justify-center mt-4",
              children: [
                /* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4 mr-2" }),
                "Sign in"
              ]
            }
          )
        ] })
      }
    ) })
  ] }) });
};
const COLLECTION_NAME$2 = "marqueeItems";
const getMarqueeItems = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME$2), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    console.log("Raw Firestore data:", querySnapshot.docs.map((doc2) => doc2.data()));
    return querySnapshot.docs.map((doc2) => {
      const data = doc2.data();
      return {
        id: doc2.id,
        text: data.text,
        link: data.link || "",
        active: data.active || true,
        order: data.order || 0,
        // Safely handle timestamp conversion
        createdAt: data.createdAt && typeof data.createdAt.toDate === "function" ? data.createdAt.toDate() : /* @__PURE__ */ new Date()
      };
    });
  } catch (error) {
    console.error("Error getting marquee items:", error);
    throw error;
  }
};
const getActiveMarqueeItems = async () => {
  const items = await getMarqueeItems();
  return items.filter((item) => item.active);
};
const addMarqueeItem = async (item) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME$2), {
      ...item,
      createdAt: /* @__PURE__ */ new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding marquee item:", error);
    throw error;
  }
};
const updateMarqueeItem = async (id, item) => {
  try {
    const docRef = doc(db, COLLECTION_NAME$2, id);
    await updateDoc(docRef, item);
  } catch (error) {
    console.error("Error updating marquee item:", error);
    throw error;
  }
};
const deleteMarqueeItem = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME$2, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting marquee item:", error);
    throw error;
  }
};
const MarqueeBanner = () => {
  const [marqueeItems, setMarqueeItems] = useState([]);
  const fallbackItems = [
    "UPSC Civil Services Exam Preparation",
    "TGPSC Group I Comprehensive Course",
    "APPSC Group I Complete Study Program",
    "Indian Economy for UPSC",
    "Indian Polity for Civil Services",
    "Geography for UPSC and State PSCs",
    "Modern History Crash Course",
    "Environment and Ecology",
    "Current Affairs Monthly Magazine"
  ];
  useEffect(() => {
    const fetchMarqueeItems = async () => {
      try {
        console.log("Fetching marquee items...");
        const items = await getActiveMarqueeItems();
        console.log("Fetched marquee items:", items);
        setMarqueeItems(items);
      } catch (error) {
        console.error("Error fetching marquee items:", error);
      }
    };
    fetchMarqueeItems();
  }, []);
  useEffect(() => {
    console.log("Marquee items state updated:", marqueeItems);
  }, [marqueeItems]);
  const displayItems = marqueeItems.length > 0 ? marqueeItems : fallbackItems.map((text) => ({
    id: `fallback-${text}`,
    text,
    active: true,
    order: 0,
    createdAt: /* @__PURE__ */ new Date()
  }));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed top-16 left-0 right-0 bg-blue-600 text-white font-semibold py-3 z-40 shadow-md",
      style: { borderBottom: "2px solid #1e40af" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-8 animate-marquee", children: [
          displayItems.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center whitespace-nowrap", children: [
            item.link ? /* @__PURE__ */ jsx("a", { href: item.link, className: "hover:text-blue-200 transition-colors", children: /* @__PURE__ */ jsx("span", { children: item.text }) }) : /* @__PURE__ */ jsx("span", { children: item.text }),
            /* @__PURE__ */ jsx("span", { className: "mx-3 text-blue-300", children: "•" })
          ] }, index)),
          displayItems.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center whitespace-nowrap", children: [
            item.link ? /* @__PURE__ */ jsx("a", { href: item.link, className: "hover:text-blue-200 transition-colors", children: /* @__PURE__ */ jsx("span", { children: item.text }) }) : /* @__PURE__ */ jsx("span", { children: item.text }),
            /* @__PURE__ */ jsx("span", { className: "mx-3 text-blue-300", children: "•" })
          ] }, `dup-${index}`))
        ] }) }),
        /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      ` } })
      ]
    }
  );
};
const COLLECTION_NAME$1 = "banners";
const getBanners = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME$1), orderBy("order"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc2) => ({
      id: doc2.id,
      ...doc2.data()
    }));
  } catch (error) {
    console.error("Error getting banners:", error);
    throw error;
  }
};
const getActiveBanners = async () => {
  try {
    const banners = await getBanners();
    return banners.filter((banner) => banner.active);
  } catch (error) {
    console.error("Error getting active banners:", error);
    throw error;
  }
};
const uploadBannerImage = async (file) => {
  try {
    const storageRef = ref(storage$1, `banners/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading banner image:", error);
    throw error;
  }
};
const createBanner = async (file, data) => {
  try {
    const banners = await getBanners();
    const order = banners.length;
    const imageUrl = await uploadBannerImage(file);
    const docRef = await addDoc(collection(db, COLLECTION_NAME$1), {
      imageUrl,
      title: data.title || "",
      link: data.link,
      order,
      active: data.active,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating banner:", error);
    throw error;
  }
};
const updateBanner = async (id, data, file) => {
  try {
    const bannerRef = doc(db, COLLECTION_NAME$1, id);
    const updateData = { ...data };
    if (file) {
      const imageUrl = await uploadBannerImage(file);
      updateData.imageUrl = imageUrl;
    }
    await updateDoc(bannerRef, updateData);
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};
const deleteBanner = async (id, imageUrl) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME$1, id));
    try {
      const storageRef = ref(storage$1, imageUrl);
      await deleteObject(storageRef);
    } catch (storageError) {
      console.error("Error deleting banner image from storage:", storageError);
    }
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};
const reorderBanners = async (orderedIds) => {
  try {
    const batch = writeBatch(db);
    orderedIds.forEach((id, index) => {
      const bannerRef = doc(db, COLLECTION_NAME$1, id);
      batch.update(bannerRef, { order: index });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error reordering banners:", error);
    throw error;
  }
};
function getProxiedImageUrl(firebaseUrl) {
  if (!firebaseUrl) {
    console.warn("Empty URL provided to getProxiedImageUrl");
    return "";
  }
  try {
    console.log("Processing URL in getProxiedImageUrl:", firebaseUrl);
    if (firebaseUrl.includes("THREEATOMS_SOCIAL_LOGO")) {
      console.log("Detected Social Logo, using dedicated endpoint");
      return "/api/social-logo";
    }
    if (firebaseUrl.includes("firebasestorage.googleapis.com")) {
      const url = new URL(firebaseUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        const decodedPath = decodeURIComponent(pathMatch[1]);
        console.log("Decoded path from Firebase URL:", decodedPath);
        const isCourseImage = decodedPath.startsWith("courses/");
        if (isCourseImage) {
          const courseImagePath = decodedPath.replace(/^courses\//, "");
          console.log("Using course image endpoint with path:", courseImagePath);
          return `/api/course-image/${courseImagePath}?originalUrl=${encodeURIComponent(firebaseUrl)}`;
        } else {
          console.log("Using general image endpoint with path:", decodedPath);
          return `/api/images/${decodedPath}?originalUrl=${encodeURIComponent(firebaseUrl)}`;
        }
      } else {
        console.error("Failed to extract path from Firebase URL:", firebaseUrl);
      }
    } else {
      console.log("Not a Firebase Storage URL, returning original:", firebaseUrl);
    }
    return firebaseUrl;
  } catch (error) {
    console.error("Error processing image URL:", error, "Original URL:", firebaseUrl);
    return firebaseUrl;
  }
}
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const fallbackBanners = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=2070",
      link: "/study-materials",
      title: "",
      order: 0,
      active: true,
      createdAt: Date.now()
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=2070",
      link: "/mock-tests",
      title: "",
      order: 1,
      active: true,
      createdAt: Date.now()
    }
  ];
  useEffect(() => {
    setIsClient(true);
    setBanners(fallbackBanners);
  }, []);
  useEffect(() => {
    if (!isClient) return;
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const fetchedBanners = await getActiveBanners();
        if (fetchedBanners.length > 0) {
          setBanners(fetchedBanners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchBanners, 100);
    return () => clearTimeout(timer);
  }, [isClient]);
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5e3);
    return () => clearInterval(timer);
  }, [banners.length]);
  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };
  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };
  if (loading && isClient) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  if (banners.length === 0) {
    return /* @__PURE__ */ jsx("section", { className: "relative h-[50vh] bg-gray-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "No banners available" }) });
  }
  return /* @__PURE__ */ jsxs("section", { className: "relative h-[50vh]", children: [
    banners.map((banner, index) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: index === currentSlide ? 1 : 0 },
        transition: { duration: 0.5 },
        className: "absolute inset-0",
        children: /* @__PURE__ */ jsx("a", { href: banner.link, className: "block h-full", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105",
            style: { backgroundImage: `url(${getProxiedImageUrl(banner.imageUrl)})` }
          }
        ) })
      },
      banner.id
    )),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: prevSlide,
        className: "absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300",
        "aria-label": "Previous slide",
        children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-6 h-6" })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: nextSlide,
        className: "absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300",
        "aria-label": "Next slide",
        children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-6 h-6" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2", children: banners.map((banner, index) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setCurrentSlide(index),
        className: `w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125" : "bg-white/50"}`,
        "aria-label": `Go to slide ${index + 1}`
      },
      index
    )) })
  ] });
};
const Resources = () => {
  const resources = [
    {
      title: "UPSC Notes",
      icon: BookOpen,
      description: "Comprehensive study material for UPSC Civil Services Exam",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      hoverColor: "hover:bg-blue-100",
      link: "/upsc-notes"
    },
    {
      title: "APPSC Notes",
      icon: FileText,
      description: "Complete study material for Andhra Pradesh PSC Exams",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      hoverColor: "hover:bg-green-100",
      link: "/appsc-notes"
    },
    {
      title: "TSPSC Notes",
      icon: BookOpen,
      description: "Detailed notes for Telangana PSC Examinations",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
      hoverColor: "hover:bg-purple-100",
      link: "/tgpsc-notes"
    },
    {
      title: "Current Affairs",
      icon: Newspaper,
      description: "Daily updates on current events relevant for competitive exams",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-500",
      hoverColor: "hover:bg-rose-100",
      link: "/current-affairs"
    }
  ];
  return /* @__PURE__ */ jsx("section", { id: "resources", className: "py-16 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container-custom", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-[var(--primary-blue)] mb-4", children: "Free Resources" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Access our comprehensive study materials and resources to ace your competitive exam preparation" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: resources.map((resource, index) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        children: /* @__PURE__ */ jsx(Link, { to: resource.link, className: "block", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${resource.bgColor} ${resource.hoverColor} rounded-lg p-6 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105`,
            children: [
              /* @__PURE__ */ jsx(resource.icon, { className: `w-12 h-12 ${resource.iconColor} mb-4` }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2", children: resource.title }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: resource.description }),
              /* @__PURE__ */ jsx("button", { className: "btn-primary w-full", children: "Explore Now" })
            ]
          }
        ) })
      },
      index
    )) })
  ] }) });
};
const About = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 bg-red-50", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 md:px-8 lg:px-16", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-gray-900", children: "About Us" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: "We are dedicated to providing comprehensive IAS exam preparation resources and guidance. Our mission is to empower aspiring civil servants with the knowledge and tools they need to succeed in their UPSC journey." }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
          /* @__PURE__ */ jsx("p", { className: "ml-3 text-gray-600", children: "Expert faculty with years of experience" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
          /* @__PURE__ */ jsx("p", { className: "ml-3 text-gray-600", children: "Comprehensive study materials and resources" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
          /* @__PURE__ */ jsx("p", { className: "ml-3 text-gray-600", children: "Personalized mentoring and guidance" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative h-96 flex items-center justify-center mx-4 md:mx-8", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/aboutbanner.png",
        alt: "Epitome IAS Logo",
        className: "max-w-full max-h-full object-contain rounded-xl"
      }
    ) })
  ] }) }) });
};
const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Singh",
      rank: "AIR 1",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      quote: "The structured approach and comprehensive study material helped me secure the top rank. The mock tests were particularly helpful in my preparation.",
      year: "2023"
    },
    {
      name: "Rahul Kumar",
      rank: "AIR 5",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      quote: "The mentorship program and daily discussion groups were game-changers in my UPSC journey. Highly recommended for serious aspirants.",
      year: "2023"
    },
    {
      name: "Anjali Sharma",
      rank: "AIR 8",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      quote: "The answer writing practice sessions and personalized feedback helped me improve my scores significantly.",
      year: "2023"
    }
  ];
  return /* @__PURE__ */ jsx("section", { id: "testimonials", className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container-custom", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-[var(--primary-blue)] mb-4", children: "Success Stories" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Hear from our toppers who achieved their UPSC dreams" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: testimonials.map((testimonial, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        className: "bg-gray-50 rounded-lg p-8 shadow-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-6", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: testimonial.image,
                alt: testimonial.name,
                className: "w-16 h-16 rounded-full object-cover"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: testimonial.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[var(--primary-red)] font-medium", children: [
                testimonial.rank,
                " - ",
                testimonial.year
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex mb-4", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(
            Star,
            {
              className: "w-5 h-5 text-yellow-400 fill-current"
            },
            i
          )) }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-600 italic", children: [
            '"',
            testimonial.quote,
            '"'
          ] })
        ]
      },
      index
    )) })
  ] }) });
};
const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqs = [
    {
      question: "How should I start my UPSC preparation?",
      answer: "Start by understanding the UPSC syllabus thoroughly, create a study plan, gather standard resources, and focus on building a strong foundation in basic concepts. Regular newspaper reading and current affairs analysis are essential from day one."
    },
    {
      question: "What is the best time to start UPSC preparation?",
      answer: "The ideal time to start UPSC preparation is right after graduation. However, it's never too late to start if you're dedicated. Early preparation gives you enough time to cover the vast syllabus and attempt multiple mocks."
    },
    {
      question: "How many hours should I study daily?",
      answer: "Quality matters more than quantity. Aim for 6-8 hours of focused study daily. Maintain consistency rather than studying for long hours irregularly. Include breaks and revision time in your schedule."
    },
    {
      question: "Is coaching necessary for UPSC preparation?",
      answer: "Coaching is not mandatory but can provide structured guidance. Many successful candidates have cleared the exam through self-study. What matters most is your dedication, consistency, and the right study material."
    },
    {
      question: "How to prepare for UPSC while working?",
      answer: "Working professionals should focus on smart study techniques, utilize weekends effectively, and maintain a balanced schedule. Digital resources and recorded lectures can be particularly helpful. Consider taking leave closer to the exam."
    }
  ];
  return /* @__PURE__ */ jsx("section", { id: "faq", className: "py-16 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container-custom", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-[var(--primary-blue)] mb-4", children: "Frequently Asked Questions" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Find answers to common questions about UPSC preparation" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: faqs.map((faq, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        className: "mb-4",
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "w-full text-left bg-white p-6 rounded-lg shadow-md flex justify-between items-center",
              onClick: () => setActiveIndex(activeIndex === index ? null : index),
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: faq.question }),
                activeIndex === index ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-6 h-6 text-[var(--primary-red)]" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-6 h-6 text-[var(--primary-red)]" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(AnimatePresence, { children: activeIndex === index && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              className: "bg-white px-6 pb-6 rounded-b-lg shadow-md",
              children: /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-4", children: faq.answer })
            }
          ) })
        ]
      },
      index
    )) })
  ] }) });
};
const handleFirestoreError$3 = (error, operation) => {
  console.error(`Error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};
const getMessages = async () => {
  try {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    handleFirestoreError$3(error, "fetch messages");
    return [];
  }
};
const createMessage = async (data) => {
  try {
    const messagesRef = collection(db, "messages");
    const now = Timestamp.now().toMillis();
    const message = {
      ...data,
      createdAt: now,
      isRead: false,
      contacted: false,
      adminComment: ""
    };
    const docRef = await addDoc(messagesRef, message);
    return docRef.id;
  } catch (error) {
    handleFirestoreError$3(error, "create message");
    return "";
  }
};
const markMessageAsRead = async (id) => {
  try {
    const docRef = doc(db, "messages", id);
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    handleFirestoreError$3(error, "mark message as read");
  }
};
const updateContactedStatus = async (id, contacted) => {
  try {
    const docRef = doc(db, "messages", id);
    await updateDoc(docRef, { contacted });
  } catch (error) {
    handleFirestoreError$3(error, "update contacted status");
  }
};
const updateAdminComment = async (id, adminComment) => {
  try {
    const docRef = doc(db, "messages", id);
    await updateDoc(docRef, { adminComment });
  } catch (error) {
    handleFirestoreError$3(error, "update admin comment");
  }
};
const deleteMessage = async (id) => {
  try {
    const docRef = doc(db, "messages", id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError$3(error, "delete message");
  }
};
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneNumber || !formData.message) {
      setError("Please fill out all fields.");
      return;
    }
    const phoneRegex = /^[0-9+\- ]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid phone number.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await createMessage(formData);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        phoneNumber: "",
        message: ""
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "contact", className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container-custom", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-[var(--primary-blue)] mb-4", children: "Get in Touch" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Have questions? We're here to help you achieve your UPSC goals" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.5 },
          className: "space-y-8",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold mb-6", children: "Contact Information" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 text-[var(--primary-red)] mr-4 mt-1" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Email" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "support@epitomeias.in" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(Phone, { className: "w-6 h-6 text-[var(--primary-red)] mr-4 mt-1" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Phone" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "+91 70956 06639" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6 text-[var(--primary-red)] mr-4 mt-1" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Hours" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Open ⋅ Closes 9 pm" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-6 h-6 text-[var(--primary-red)] mr-4 mt-1" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Address" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Epitome IAS, 1st Floor, 1-1-101/A, RTC X Rd, above Pizza Hut, Vivek nagar, Ashok Nagar, Hyderabad, Telangana 500020" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1", children: "Located in: RTC X Roads Metro Station" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold mb-4", children: "Connect With Us" }),
              /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
                /* @__PURE__ */ jsx("a", { href: "https://facebook.com/epitomeiasacademy", target: "_blank", rel: "noopener noreferrer", className: "p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors", children: /* @__PURE__ */ jsx(Facebook, { className: "w-5 h-5 text-[var(--primary-blue)]" }) }),
                /* @__PURE__ */ jsx("a", { href: "https://instagram.com/epitome_ias_academy", target: "_blank", rel: "noopener noreferrer", className: "p-2 bg-gray-100 rounded-full hover:bg-pink-100 transition-colors", children: /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5 text-[var(--primary-red)]" }) }),
                /* @__PURE__ */ jsx("a", { href: "https://x.com/EpitomeIAS", target: "_blank", rel: "noopener noreferrer", className: "p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors", children: /* @__PURE__ */ jsx(Twitter, { className: "w-5 h-5 text-[var(--primary-blue)]" }) }),
                /* @__PURE__ */ jsx("a", { href: "https://linkedin.com/in/epitome-ias-academy", target: "_blank", rel: "noopener noreferrer", className: "p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors", children: /* @__PURE__ */ jsx(Linkedin, { className: "w-5 h-5 text-[var(--primary-blue)]" }) })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.5 },
          children: submitSuccess ? /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-6 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-green-800 mb-2", children: "Message Sent!" }),
            /* @__PURE__ */ jsx("p", { className: "text-green-700 mb-4", children: "Thank you for contacting us. We will get back to you soon." }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSubmitSuccess(false),
                className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",
                children: "Send Another Message"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
            error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", children: error }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-1", children: "Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "name",
                  name: "name",
                  value: formData.name,
                  onChange: handleChange,
                  className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)]",
                  placeholder: "Your name",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "phoneNumber", className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone Number" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  id: "phoneNumber",
                  name: "phoneNumber",
                  value: formData.phoneNumber,
                  onChange: handleChange,
                  className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)]",
                  placeholder: "Your phone number",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-1", children: "Message" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "message",
                  name: "message",
                  value: formData.message,
                  onChange: handleChange,
                  rows: 4,
                  className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)]",
                  placeholder: "Your message",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "btn-primary w-full flex justify-center items-center",
                disabled: isSubmitting,
                children: isSubmitting ? "Sending..." : "Send Message"
              }
            )
          ] })
        }
      )
    ] })
  ] }) });
};
const Footer = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "bg-[var(--primary-blue)] text-white pt-16 pb-8", children: /* @__PURE__ */ jsxs("div", { className: "container-custom", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://i.postimg.cc/qMYWSV1h/Untitled-design-12.png",
            alt: "Epitome IAS Logo",
            className: "h-12 w-auto mb-4"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-gray-200 mb-4", children: "Empowering UPSC aspirants with comprehensive study materials and expert guidance." }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsx("a", { href: "https://facebook.com/epitomeiasacademy", target: "_blank", rel: "noopener noreferrer", className: "text-gray-200 hover:text-white transition-colors", "aria-label": "Facebook", children: /* @__PURE__ */ jsx(Facebook, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("a", { href: "https://x.com/EpitomeIAS", target: "_blank", rel: "noopener noreferrer", className: "text-gray-200 hover:text-white transition-colors", "aria-label": "Twitter", children: /* @__PURE__ */ jsx(Twitter, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("a", { href: "https://linkedin.com/in/epitome-ias-academy", target: "_blank", rel: "noopener noreferrer", className: "text-gray-200 hover:text-white transition-colors", "aria-label": "LinkedIn", children: /* @__PURE__ */ jsx(Linkedin, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("a", { href: "https://instagram.com/epitome_ias_academy", target: "_blank", rel: "noopener noreferrer", className: "text-gray-200 hover:text-white transition-colors", "aria-label": "Instagram", children: /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Quick Links" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "text-gray-200 hover:text-white transition-colors", children: "Home" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#resources", className: "text-gray-200 hover:text-white transition-colors", children: "Resources" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#testimonials", className: "text-gray-200 hover:text-white transition-colors", children: "Success Stories" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#faq", className: "text-gray-200 hover:text-white transition-colors", children: "FAQ" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#contact", className: "text-gray-200 hover:text-white transition-colors", children: "Contact" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Contact Info" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-[var(--primary-red)] mr-2 mt-1" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-200", children: "support@epitomeias.in" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 text-[var(--primary-red)] mr-2 mt-1" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-200", children: "+91 70956 06639" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-[var(--primary-red)] mr-2 mt-1" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-200", children: "Open ⋅ Closes 9 pm" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-[var(--primary-red)] mr-2 mt-1" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-200", children: "RTC X Roads Metro Station, Hyderabad, Telangana 500020" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Legal" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/terms-and-conditions", className: "text-gray-200 hover:text-white transition-colors", children: "Terms and Conditions" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/privacy-policy", className: "text-gray-200 hover:text-white transition-colors", children: "Privacy Policy" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/refund-policy", className: "text-gray-200 hover:text-white transition-colors", children: "Refund Policy" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-white/10 pt-8", children: /* @__PURE__ */ jsxs("p", { className: "text-center text-gray-200", children: [
      "© ",
      currentYear,
      " All rights reserved @ Epitome IAS Academy. Designed & Developed by",
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://webbingprotechnologies.com",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-white hover:text-blue-200 underline transition-colors",
          children: "Webbing Pro Technologies"
        }
      ),
      "– 9059329297."
    ] }) })
  ] }) });
};
const COLLECTION_NAME = "quizzes";
const getQuizzes = async () => {
  try {
    const quizQuery = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(quizQuery);
    return querySnapshot.docs.map((doc2) => {
      const data = doc2.data();
      return {
        id: doc2.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    });
  } catch (error) {
    console.error("Error getting quizzes:", error);
    throw error;
  }
};
const getQuizById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    }
    return null;
  } catch (error) {
    console.error(`Error getting quiz with ID ${id}:`, error);
    throw error;
  }
};
const createQuiz = async (quizData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...quizData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};
const updateQuiz = async (id, quizData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...quizData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating quiz with ID ${id}:`, error);
    throw error;
  }
};
const deleteQuiz = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting quiz with ID ${id}:`, error);
    throw error;
  }
};
const QuizListPage = ({ initialData }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) {
      setQuizzes(initialData.quizzes);
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.quizzes) return;
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const quizzesData = await getQuizzes();
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [isClient, initialData]);
  if (loading && isClient) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  const mainsPyqs = quizzes.filter((q) => q.quizType === "mainsPyqs");
  const prelimsPractice = quizzes.filter((q) => q.quizType === "prelimsPractice");
  const mainsPractice = quizzes.filter((q) => q.quizType === "mainsPractice");
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-16 pb-12", children: /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 sm:text-4xl", children: "UPSC Quiz Categories" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4", children: "Choose a category to practice with our specialized quizzes" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1", children: [
      /* @__PURE__ */ jsx(Link, { to: "/mains-pyqs", className: "block", children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6 flex flex-col h-full", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-gray-900 mb-4", children: "Mains PYQs" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6 flex-grow", children: "Practice with actual questions from previous UPSC Mains examinations. Test your knowledge and improve your answer writing skills." }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800", children: [
            mainsPyqs.length,
            " Quizzes Available"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
          "View Quizzes ",
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(Link, { to: "/prelims-practice", className: "block", children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6 flex flex-col h-full", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-gray-900 mb-4", children: "Prelims Practice" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6 flex-grow", children: "Enhance your MCQ solving skills with our carefully curated questions designed to prepare you for UPSC Prelims." }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800", children: [
            prelimsPractice.length,
            " Quizzes Available"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
          "View Quizzes ",
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(Link, { to: "/mains-practice", className: "block", children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6 flex flex-col h-full", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-gray-900 mb-4", children: "Mains Practice" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6 flex-grow", children: "Study with detailed explanations for each question. Perfect for understanding concepts and improving your answer quality." }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800", children: [
            mainsPractice.length,
            " Quizzes Available"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
          "View Quizzes ",
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
        ] }) })
      ] }) })
    ] }),
    quizzes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-8 text-center", children: "Available Quizzes" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: quizzes.map((quiz) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: quiz.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-4", children: quiz.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            quiz.totalQuestions,
            " questions"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            quiz.timeInMinutes,
            " min"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "capitalize", children: quiz.difficulty })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: `/quiz/${quiz.id}`,
            className: "mt-4 inline-block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors",
            children: "Start Quiz"
          }
        )
      ] }, quiz.id)) })
    ] })
  ] }) }) });
};
const QuizQuestion = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
  totalQuestions,
  quizType,
  showAnswer
}) => {
  const isMainsPractice = quizType === "mainsPractice";
  const shouldShowAnswer = showAnswer || isMainsPractice && selectedAnswer !== null;
  const getOptionClass = (index) => {
    if (shouldShowAnswer) {
      if (index === question.correctAnswer) {
        return "bg-green-50 border-green-500";
      }
      if (index === selectedAnswer) {
        return "bg-red-50 border-red-500";
      }
      return "border-gray-200";
    }
    if (selectedAnswer === index) {
      return "bg-indigo-50 border-indigo-500";
    }
    return "hover:bg-gray-50 border-gray-200";
  };
  const handleOptionClick = (index) => {
    if (isMainsPractice && selectedAnswer !== null) {
      return;
    }
    onSelectAnswer(index);
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-gray-800 mb-2", children: [
        "Question ",
        questionNumber,
        " of ",
        totalQuestions
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "text-lg text-gray-700",
          dangerouslySetInnerHTML: { __html: question.question }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: question.options.map((option, index) => /* @__PURE__ */ jsx(
      "div",
      {
        onClick: () => handleOptionClick(index),
        className: `p-4 border rounded-lg transition-all ${isMainsPractice && selectedAnswer !== null ? "cursor-default" : "cursor-pointer"} ${getOptionClass(index)}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedAnswer === index && !shouldShowAnswer ? "border-indigo-600 bg-indigo-600" : shouldShowAnswer && index === question.correctAnswer ? "border-green-600 bg-green-600" : "border-gray-300"}`, children: selectedAnswer === index && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-white rounded-full" }) }),
          /* @__PURE__ */ jsx("span", { className: `${selectedAnswer === index && !shouldShowAnswer ? "text-indigo-700 font-medium" : shouldShowAnswer && index === question.correctAnswer ? "text-green-700 font-medium" : shouldShowAnswer && index === selectedAnswer ? "text-red-700 font-medium" : "text-gray-700"}`, children: option })
        ] })
      },
      index
    )) }),
    shouldShowAnswer && question.explanation && /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-4 border-t border-gray-200", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-md font-semibold text-gray-800 mb-1", children: "Explanation:" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "text-sm text-gray-600",
          dangerouslySetInnerHTML: { __html: question.explanation }
        }
      )
    ] })
  ] }) });
};
const QuizNavigation = ({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onNavigate,
  onSubmit,
  onPrevious,
  onNext,
  userAnswers,
  quizType
}) => {
  const answers = userAnswers || answeredQuestions;
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      onNavigate(currentQuestion - 1);
    }
  };
  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      onNavigate(currentQuestion + 1);
    }
  };
  const answeredCount = answers.filter((a) => a !== null).length;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm rounded-lg p-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Question Navigation" }),
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handlePrevious,
          disabled: currentQuestion === 0,
          className: `px-3 py-1 rounded-md font-medium flex items-center text-sm ${currentQuestion === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"}`,
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
            "Previous"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleNext,
          disabled: currentQuestion === totalQuestions - 1,
          className: `px-3 py-1 rounded-md font-medium flex items-center text-sm ${currentQuestion === totalQuestions - 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"}`,
          children: [
            "Next",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 ml-1" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Quiz Progress" }),
      /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-1.5 mt-1 mb-3", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-1.5 rounded-full bg-green-500",
          style: { width: `${answeredCount / totalQuestions * 100}%` }
        }
      ) }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
        answeredCount,
        " of ",
        totalQuestions,
        " questions answered"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2 mb-6", children: Array.from({ length: totalQuestions }).map((_, index) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onNavigate(index),
        className: `h-9 w-full rounded-md flex items-center justify-center font-medium text-sm transition-colors ${index === currentQuestion ? "bg-indigo-600 text-white" : answers[index] !== null ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`,
        children: index + 1
      },
      index
    )) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onSubmit,
        className: "w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors",
        children: quizType === "mainsPractice" ? "Finish Review" : "Submit Quiz"
      }
    )
  ] });
};
const QuizTimer = ({
  startTime,
  totalSeconds,
  onTimeUp,
  onSubmit,
  disableTimer
}) => {
  const [timeLeft, setTimeLeft] = useState(disableTimer ? 0 : totalSeconds);
  useEffect(() => {
    if (disableTimer) return;
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1e3);
    const newRemainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
    setTimeLeft(newRemainingSeconds);
    if (newRemainingSeconds <= 0) {
      onTimeUp();
    }
  }, [startTime, totalSeconds, onTimeUp, disableTimer]);
  useEffect(() => {
    if (disableTimer) {
      return;
    }
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
        }
        return Math.max(0, newTime);
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, disableTimer]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const percentageLeft = timeLeft / totalSeconds * 100;
  const getTimerColor = () => {
    if (percentageLeft > 50) return "bg-green-500";
    if (percentageLeft > 20) return "bg-yellow-500";
    return "bg-red-500";
  };
  const handleSubmit = () => {
    if (onSubmit) {
      const timeSpent = totalSeconds - timeLeft;
      onSubmit(timeSpent);
    }
  };
  if (disableTimer) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm rounded-lg p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-4 text-center", children: "Mains Practice Mode" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 text-center", children: "Timer is disabled for this quiz type. Take your time to review." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm rounded-lg p-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Time Remaining" }),
    /* @__PURE__ */ jsx("div", { className: "text-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-gray-800", children: formatTime(timeLeft) }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mb-4", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `h-2 rounded-full transition-all ${getTimerColor()}`,
        style: { width: `${percentageLeft}%` }
      }
    ) }),
    onSubmit && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleSubmit,
        className: "w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors",
        children: "Submit Quiz"
      }
    )
  ] });
};
const QuizResult = ({
  quiz,
  userAnswers,
  timeTaken
}) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const questions = quiz.questions;
  const correctAnswers = questions.filter(
    (question, index) => userAnswers[index] === question.correctAnswer
  ).length;
  const score = Math.round(correctAnswers / questions.length * 100);
  useEffect(() => {
    const saveQuizAttempt = async () => {
      if (!user) return;
      try {
        if (saved) return;
        await addDoc(collection(db, "quizAttempts"), {
          userId: user.uid,
          userEmail: user.email,
          userDisplayName: user.displayName || "Anonymous User",
          quizId: quiz.id,
          quizTitle: quiz.title,
          score: correctAnswers,
          scorePercentage: score,
          totalQuestions: questions.length,
          timeTaken,
          timestamp: serverTimestamp(),
          userAnswers
        });
        setSaved(true);
      } catch (error) {
        console.error("Error saving quiz attempt:", error);
        setSaveError("Failed to save your quiz results. Please try again later.");
      }
    };
    saveQuizAttempt();
  }, [user, quiz, questions, userAnswers, correctAnswers, score, timeTaken, saved]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
  };
  const getResultMessage = () => {
    if (score >= 90) {
      return {
        title: "Excellent!",
        message: "You have an exceptional understanding of this topic!",
        color: "text-green-600"
      };
    } else if (score >= 70) {
      return {
        title: "Great Job!",
        message: "You have a good grasp of this topic.",
        color: "text-green-600"
      };
    } else if (score >= 50) {
      return {
        title: "Good Effort!",
        message: "You have a basic understanding of this topic.",
        color: "text-yellow-600"
      };
    } else {
      return {
        title: "Keep Learning!",
        message: "This topic needs more study. Don't give up!",
        color: "text-red-600"
      };
    }
  };
  const resultMessage = getResultMessage();
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-indigo-600 px-6 py-8 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Quiz Results" }),
      /* @__PURE__ */ jsx("p", { className: "text-indigo-100", children: quiz.title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center h-32 w-32 rounded-full bg-indigo-50 mb-4", children: /* @__PURE__ */ jsxs("span", { className: "text-4xl font-bold text-indigo-600", children: [
          score,
          "%"
        ] }) }),
        /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold ${resultMessage.color} mb-2`, children: resultMessage.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: resultMessage.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Score" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl font-semibold text-gray-800", children: [
            correctAnswers,
            " / ",
            questions.length
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Time Taken" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold text-gray-800", children: formatTime(timeTaken) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Accuracy" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl font-semibold text-gray-800", children: [
            score,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-4", children: "Question Review" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: questions.map((question, index) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-6 rounded-lg", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-medium text-gray-800 mb-4", children: [
            index + 1,
            ". ",
            question.question
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-4", children: question.options.map((option, optionIndex) => /* @__PURE__ */ jsx(
            "div",
            {
              className: `p-3 rounded-md ${optionIndex === question.correctAnswer ? "bg-green-100 border border-green-300" : optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer ? "bg-red-100 border border-red-300" : "bg-white border border-gray-200"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxs("div", { className: `w-5 h-5 rounded-full flex items-center justify-center mr-3 ${optionIndex === question.correctAnswer ? "bg-green-500 text-white" : optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer ? "bg-red-500 text-white" : "border border-gray-300"}`, children: [
                  optionIndex === question.correctAnswer && /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                  optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer && /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
                ] }),
                /* @__PURE__ */ jsx("span", { className: `${optionIndex === question.correctAnswer ? "text-green-800 font-medium" : optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer ? "text-red-800 font-medium" : "text-gray-700"}`, children: option })
              ] })
            },
            optionIndex
          )) }),
          /* @__PURE__ */ jsx("div", { className: `text-sm ${userAnswers[index] === question.correctAnswer ? "text-green-600" : "text-red-600"}`, children: userAnswers[index] === question.correctAnswer ? "✓ Correct answer" : userAnswers[index] === null ? "✗ Not answered" : "✗ Incorrect answer" })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/quizzes",
            className: "px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors",
            children: "Back to Quizzes"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: `/quiz/${quiz.id}`,
            className: "px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors",
            children: "Retry Quiz"
          }
        )
      ] }),
      saveError && /* @__PURE__ */ jsx("div", { className: "mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", children: saveError })
    ] })
  ] }) }) });
};
const QuizDetails = ({ quiz, onStartQuiz }) => {
  var _a2;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm rounded-lg p-8 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: quiz.title }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: quiz.description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4", children: "Instructions" }),
      /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-gray-700", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2" }),
          /* @__PURE__ */ jsx("span", { children: "Read each question carefully before answering." })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2" }),
          /* @__PURE__ */ jsx("span", { children: "You can navigate between questions using the navigation panel." })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2" }),
          /* @__PURE__ */ jsx("span", { children: "The timer will start as soon as you begin the quiz." })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2" }),
          /* @__PURE__ */ jsx("span", { children: "Your quiz will be automatically submitted when the time is up." })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2" }),
          /* @__PURE__ */ jsx("span", { children: "You can review and change your answers before submitting." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-indigo-100 p-2 rounded-full mr-3", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-indigo-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total Questions" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-800", children: ((_a2 = quiz.questions) == null ? void 0 : _a2.length) || 0 })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-indigo-100 p-2 rounded-full mr-3", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-indigo-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Time Limit" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-gray-800", children: [
            quiz.timeInMinutes,
            " minutes"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onStartQuiz,
        className: "w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors",
        children: "Start Quiz"
      }
    )
  ] });
};
const QuizPage = () => {
  var _a2;
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressId, setProgressId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [questionStates, setQuestionStates] = useState([]);
  useEffect(() => {
    if (!quizId) {
      setError("Quiz ID is missing");
      setLoading(false);
      return;
    }
    if (!user) {
      setError("You must be logged in to take a quiz");
      setLoading(false);
      return;
    }
    const fetchQuizAndProgress = async () => {
      try {
        const quizData = await getQuizById(quizId);
        if (!quizData) {
          setError("Quiz not found");
          setLoading(false);
          return;
        }
        setQuiz(quizData);
        const progressQuery = query(
          collection(db, "quizProgress"),
          where("userId", "==", user.uid),
          where("quizId", "==", quizId)
        );
        const progressSnapshot = await getDocs(progressQuery);
        if (!progressSnapshot.empty) {
          const progressData = progressSnapshot.docs[0].data();
          setProgressId(progressSnapshot.docs[0].id);
          setCurrentQuestionIndex(progressData.currentQuestionIndex);
          setUserAnswers(progressData.userAnswers);
          setQuizStarted(true);
          setStartTime(progressData.startTime);
        } else {
          setUserAnswers(Array(quizData.questions.length).fill(null));
          setQuestionStates(Array(quizData.questions.length).fill({ showAnswer: false }));
        }
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAndProgress();
  }, [quizId, user]);
  const saveProgress = async () => {
    if (!user || !quizId || !quiz || quizCompleted) return;
    try {
      const progressData = {
        userId: user.uid,
        quizId,
        currentQuestionIndex,
        userAnswers,
        startTime: startTime || Date.now(),
        lastUpdated: /* @__PURE__ */ new Date()
      };
      if (progressId) {
        await updateDoc(doc(db, "quizProgress", progressId), progressData);
      } else {
        const docRef = await addDoc(collection(db, "quizProgress"), progressData);
        setProgressId(docRef.id);
      }
    } catch (err) {
      console.error("Error saving quiz progress:", err);
    }
  };
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      saveProgress();
    }
    return () => {
      if (quizStarted && !quizCompleted) {
        saveProgress();
      }
    };
  }, [currentQuestionIndex, userAnswers, quizStarted, quizCompleted]);
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };
  const handleSelectAnswer = (answerIndex) => {
    if ((quiz == null ? void 0 : quiz.quizType) === "mainsPractice") {
      const newQuestionStates = [...questionStates];
      newQuestionStates[currentQuestionIndex] = { ...newQuestionStates[currentQuestionIndex], showAnswer: true };
      setQuestionStates(newQuestionStates);
    }
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newUserAnswers);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };
  const handleNavigate = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
  };
  const handleNextQuestion = () => {
    var _a3;
    if (currentQuestionIndex < (((_a3 = quiz == null ? void 0 : quiz.questions) == null ? void 0 : _a3.length) || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const handleSubmitQuiz = async (timeSpent) => {
    if ((quiz == null ? void 0 : quiz.quizType) === "mainsPractice") {
      setQuizCompleted(true);
      if (progressId) {
        try {
          await deleteDoc(doc(db, "quizProgress", progressId));
        } catch (err) {
          console.error("Error deleting quiz progress for mainsPractice:", err);
        }
      }
      return;
    }
    {
      const endTime = Date.now();
      const timeElapsed = Math.floor((endTime - (startTime || endTime)) / 1e3);
      setTimeTaken(timeElapsed);
    }
    setQuizCompleted(true);
    if (progressId) {
      try {
        await deleteDoc(doc(db, "quizProgress", progressId));
      } catch (err) {
        console.error("Error deleting quiz progress:", err);
      }
    }
  };
  const handleTimeUp = () => {
    handleSubmitQuiz();
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", role: "alert", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error" }),
        /* @__PURE__ */ jsx("p", { children: error })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/quizzes"),
          className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          children: "Back to Quizzes"
        }
      ) })
    ] }) });
  }
  if (!quiz) {
    return null;
  }
  if (quizCompleted) {
    return /* @__PURE__ */ jsx(
      QuizResult,
      {
        quiz,
        userAnswers,
        timeTaken
      }
    );
  }
  if (!quizStarted) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(QuizDetails, { quiz, onStartQuiz: handleStartQuiz }) });
  }
  const currentQuestion = quiz.questions[currentQuestionIndex];
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center mb-8", children: /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: quiz.title }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsx(
        QuizQuestion,
        {
          question: currentQuestion,
          selectedAnswer: userAnswers[currentQuestionIndex],
          onSelectAnswer: handleSelectAnswer,
          quizType: quiz.quizType,
          showAnswer: quiz.quizType === "mainsPractice" ? (_a2 = questionStates[currentQuestionIndex]) == null ? void 0 : _a2.showAnswer : false,
          questionNumber: currentQuestionIndex + 1,
          totalQuestions: quiz.questions.length
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-6", children: [
        /* @__PURE__ */ jsx(
          QuizTimer,
          {
            startTime: startTime || Date.now(),
            totalSeconds: quiz.timeInMinutes * 60,
            onTimeUp: handleTimeUp,
            disableTimer: quiz.quizType === "mainsPractice"
          }
        ),
        /* @__PURE__ */ jsx(
          QuizNavigation,
          {
            currentQuestion: currentQuestionIndex,
            totalQuestions: quiz.questions.length,
            answeredQuestions: userAnswers,
            onNavigate: handleNavigate,
            onSubmit: () => handleSubmitQuiz(),
            quizType: quiz.quizType,
            onPrevious: handlePrevQuestion,
            onNext: handleNextQuestion
          }
        )
      ] })
    ] })
  ] }) });
};
const PrelimsPracticePage = ({ initialData }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) {
      const prelimsQuizzes = initialData.quizzes.filter(
        (quiz) => quiz.quizType === "prelimsPractice" && quiz.examBoard === "upsc"
      );
      setQuizzes(prelimsQuizzes);
      setFilteredQuizzes(prelimsQuizzes);
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.quizzes) return;
    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("quizType", "==", "prelimsPractice"),
          where("examBoard", "==", "upsc")
        );
        const querySnapshot = await getDocs(q);
        const quizData = [];
        querySnapshot.forEach((doc2) => {
          quizData.push({ id: doc2.id, ...doc2.data() });
        });
        setQuizzes(quizData);
        setFilteredQuizzes(quizData);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [isClient, initialData]);
  useEffect(() => {
    if (quizzes.length === 0) return;
    let filtered = [...quizzes];
    switch (dateFilter) {
      case "today":
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= today;
        });
        break;
      case "week":
        const weekAgo = /* @__PURE__ */ new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= weekAgo;
        });
        break;
      case "month":
        const monthAgo = /* @__PURE__ */ new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime && quizDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate <= toDateTime;
          });
        }
        break;
    }
    setFilteredQuizzes(filtered);
  }, [dateFilter, quizzes, fromDate, toDate]);
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", role: "alert", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 sm:text-4xl", children: "UPSC Prelims Practice" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4", children: "Practice with carefully curated questions to prepare for UPSC Prelims" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 sm:mb-0", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-5 w-5 text-gray-500 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filter by date:" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 justify-center sm:justify-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "all" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Quizzes"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "today" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Today"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "week" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Week"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "month" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Month"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "custom" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Custom Range"
              ]
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] }),
      dateFilter !== "all" && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-gray-500 text-center sm:text-right", children: [
        "Showing ",
        filteredQuizzes.length,
        " ",
        filteredQuizzes.length === 1 ? "quiz" : "quizzes",
        " from ",
        dateFilter === "today" ? "today" : dateFilter === "week" ? "the past 7 days" : "the past 30 days"
      ] })
    ] }),
    filteredQuizzes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: "No quizzes available at the moment. Please check back later." }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1", children: filteredQuizzes.map((quiz) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleQuizClick(quiz.id),
        className: "bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all hover:shadow-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 truncate", children: quiz.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500 line-clamp-2", children: quiz.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800", children: [
                  quiz.totalQuestions,
                  " Questions"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800", children: [
                  quiz.timeInMinutes,
                  " Minutes"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 text-xs font-medium rounded-full 
                      ${quiz.difficulty === "easy" ? "bg-green-100 text-green-800" : quiz.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
                  children: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
            "Start Quiz ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
          ] }) })
        ]
      },
      quiz.id
    )) })
  ] }) });
};
const MainsPracticePage = ({ initialData }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) {
      const mainsQuizzes = initialData.quizzes.filter(
        (quiz) => quiz.quizType === "mainsPractice" && quiz.examBoard === "upsc"
      );
      const quizData = mainsQuizzes.map((quiz) => ({
        ...quiz,
        createdAt: quiz.createdAt instanceof Timestamp ? quiz.createdAt.toDate() : new Date(quiz.createdAt)
      }));
      setQuizzes(quizData);
      setFilteredQuizzes(quizData);
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.quizzes) return;
    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("quizType", "==", "mainsPractice"),
          where("examBoard", "==", "upsc")
        );
        const querySnapshot = await getDocs(q);
        const quizData = [];
        querySnapshot.forEach((doc2) => {
          const data = doc2.data();
          const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : /* @__PURE__ */ new Date();
          quizData.push({
            id: doc2.id,
            ...data,
            createdAt
          });
        });
        setQuizzes(quizData);
        setFilteredQuizzes(quizData);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [isClient, initialData]);
  useEffect(() => {
    if (quizzes.length === 0) return;
    let filtered = [...quizzes];
    switch (dateFilter) {
      case "today":
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt instanceof Timestamp ? quiz.createdAt.toDate() : new Date(quiz.createdAt);
          return quizDate >= today;
        });
        break;
      case "week":
        const weekAgo = /* @__PURE__ */ new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt instanceof Timestamp ? quiz.createdAt.toDate() : new Date(quiz.createdAt);
          return quizDate >= weekAgo;
        });
        break;
      case "month":
        const monthAgo = /* @__PURE__ */ new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt instanceof Timestamp ? quiz.createdAt.toDate() : new Date(quiz.createdAt);
          return quizDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt instanceof Timestamp ? quiz.createdAt.toDate() : new Date(quiz.createdAt);
            return quizDate >= fromDateTime && quizDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt instanceof Timestamp ? quiz.createdAt.toDate() : new Date(quiz.createdAt);
            return quizDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt instanceof Timestamp ? quiz.createdAt.toDate() : new Date(quiz.createdAt);
            return quizDate <= toDateTime;
          });
        }
        break;
      default:
        filtered = quizzes;
    }
    setFilteredQuizzes(filtered);
  }, [quizzes, dateFilter, fromDate, toDate]);
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", role: "alert", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 sm:text-4xl", children: "UPSC Mains Practice" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4", children: "Practice with detailed explanations for UPSC Mains preparation" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-medium text-gray-900 flex items-center", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5 mr-2 text-gray-500" }),
          "Filter by date:"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Quizzes"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "today" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "Today"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "week" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "This Week"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "month" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "This Month"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "custom" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "Custom Range"
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] })
    ] }),
    filteredQuizzes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: dateFilter === "all" ? "No quizzes available at the moment. Please check back later." : `No quizzes found for the selected time period (${dateFilter}). Try a different filter or check back later.` }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1", children: filteredQuizzes.map((quiz) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleQuizClick(quiz.id),
        className: "bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all hover:shadow-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 truncate", children: quiz.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500 line-clamp-2", children: quiz.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800", children: [
                  quiz.totalQuestions,
                  " Questions"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800", children: "Self-paced" })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 text-xs font-medium rounded-full 
                      ${quiz.difficulty === "easy" ? "bg-green-100 text-green-800" : quiz.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
                  children: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
            "Start Practice ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
          ] }) })
        ]
      },
      quiz.id
    )) })
  ] }) });
};
const TGPSCPrelimsPracticePage = ({ initialData }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) {
      const tgpscQuizzes = initialData.quizzes.filter(
        (quiz) => quiz.quizType === "prelimsPractice" && quiz.examBoard === "tgpsc"
      );
      setQuizzes(tgpscQuizzes);
      setFilteredQuizzes(tgpscQuizzes);
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.quizzes) return;
    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("quizType", "==", "prelimsPractice"),
          where("examBoard", "==", "tgpsc")
        );
        const querySnapshot = await getDocs(q);
        const quizData = [];
        querySnapshot.forEach((doc2) => {
          quizData.push({ id: doc2.id, ...doc2.data() });
        });
        setQuizzes(quizData);
        setFilteredQuizzes(quizData);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [isClient, initialData]);
  useEffect(() => {
    if (quizzes.length === 0) return;
    let filtered = [...quizzes];
    switch (dateFilter) {
      case "today":
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= today;
        });
        break;
      case "week":
        const weekAgo = /* @__PURE__ */ new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= weekAgo;
        });
        break;
      case "month":
        const monthAgo = /* @__PURE__ */ new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime && quizDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate <= toDateTime;
          });
        }
        break;
    }
    setFilteredQuizzes(filtered);
  }, [dateFilter, quizzes, fromDate, toDate]);
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", role: "alert", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 sm:text-4xl", children: "TGPSC Prelims Practice" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4", children: "Practice with carefully curated questions to prepare for TGPSC Prelims" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 sm:mb-0", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-5 w-5 text-gray-500 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filter by date:" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 justify-center sm:justify-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "all" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Quizzes"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "today" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Today"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "week" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Week"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "month" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Month"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "custom" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Custom Range"
              ]
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] }),
      dateFilter !== "all" && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-gray-500 text-center sm:text-right", children: [
        "Showing ",
        filteredQuizzes.length,
        " ",
        filteredQuizzes.length === 1 ? "quiz" : "quizzes",
        " from ",
        dateFilter === "today" ? "today" : dateFilter === "week" ? "the past 7 days" : "the past 30 days"
      ] })
    ] }),
    filteredQuizzes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: "No quizzes available at the moment. Please check back later." }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1", children: filteredQuizzes.map((quiz) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleQuizClick(quiz.id),
        className: "bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all hover:shadow-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 truncate", children: quiz.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500 line-clamp-2", children: quiz.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800", children: [
                  quiz.totalQuestions,
                  " Questions"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800", children: [
                  quiz.timeInMinutes,
                  " Minutes"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 text-xs font-medium rounded-full 
                      ${quiz.difficulty === "easy" ? "bg-green-100 text-green-800" : quiz.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
                  children: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
            "Start Quiz ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
          ] }) })
        ]
      },
      quiz.id
    )) })
  ] }) });
};
const TGPSCMainsPracticePage = ({ initialData }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) {
      const tgpscQuizzes = initialData.quizzes.filter(
        (quiz) => quiz.quizType === "mainsPractice" && quiz.examBoard === "tgpsc"
      );
      setQuizzes(tgpscQuizzes);
      setFilteredQuizzes(tgpscQuizzes);
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.quizzes) return;
    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("quizType", "==", "mainsPractice"),
          where("examBoard", "==", "tgpsc")
        );
        const querySnapshot = await getDocs(q);
        const quizData = [];
        querySnapshot.forEach((doc2) => {
          quizData.push({ id: doc2.id, ...doc2.data() });
        });
        setQuizzes(quizData);
        setFilteredQuizzes(quizData);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [isClient, initialData]);
  useEffect(() => {
    if (quizzes.length === 0) return;
    let filtered = [...quizzes];
    switch (dateFilter) {
      case "today":
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= today;
        });
        break;
      case "week":
        const weekAgo = /* @__PURE__ */ new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= weekAgo;
        });
        break;
      case "month":
        const monthAgo = /* @__PURE__ */ new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime && quizDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate <= toDateTime;
          });
        }
        break;
    }
    setFilteredQuizzes(filtered);
  }, [dateFilter, quizzes, fromDate, toDate]);
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", role: "alert", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 sm:text-4xl", children: "TGPSC Mains Practice" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4", children: "Practice with detailed explanations for TGPSC Mains preparation" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 sm:mb-0", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-5 w-5 text-gray-500 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filter by date:" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 justify-center sm:justify-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "all" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Quizzes"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "today" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Today"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "week" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Week"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "month" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Month"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "custom" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Custom Range"
              ]
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] }),
      dateFilter !== "all" && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-gray-500 text-center sm:text-right", children: [
        "Showing ",
        filteredQuizzes.length,
        " ",
        filteredQuizzes.length === 1 ? "quiz" : "quizzes",
        " from ",
        dateFilter === "today" ? "today" : dateFilter === "week" ? "the past 7 days" : dateFilter === "month" ? "the past 30 days" : "the selected range"
      ] })
    ] }),
    filteredQuizzes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxs("p", { className: "text-lg text-gray-600", children: [
      "No quizzes available ",
      dateFilter !== "all" ? "for the selected date range" : "at the moment",
      ". Please check back later."
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1", children: filteredQuizzes.map((quiz) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleQuizClick(quiz.id),
        className: "bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all hover:shadow-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 truncate", children: quiz.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500 line-clamp-2", children: quiz.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800", children: [
                  quiz.totalQuestions,
                  " Questions"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800", children: "Self-paced" })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 text-xs font-medium rounded-full 
                      ${quiz.difficulty === "easy" ? "bg-green-100 text-green-800" : quiz.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
                  children: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
            "Start Practice ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
          ] }) })
        ]
      },
      quiz.id
    )) })
  ] }) });
};
const APPSCPrelimsPracticePage = ({ initialData }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) {
      const appscQuizzes = initialData.quizzes.filter(
        (quiz) => quiz.quizType === "prelimsPractice" && quiz.examBoard === "appsc"
      );
      setQuizzes(appscQuizzes);
      setFilteredQuizzes(appscQuizzes);
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.quizzes) return;
    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("quizType", "==", "prelimsPractice"),
          where("examBoard", "==", "appsc")
        );
        const querySnapshot = await getDocs(q);
        const quizData = [];
        querySnapshot.forEach((doc2) => {
          quizData.push({ id: doc2.id, ...doc2.data() });
        });
        setQuizzes(quizData);
        setFilteredQuizzes(quizData);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [isClient, initialData]);
  useEffect(() => {
    if (quizzes.length === 0) return;
    let filtered = [...quizzes];
    switch (dateFilter) {
      case "today":
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= today;
        });
        break;
      case "week":
        const weekAgo = /* @__PURE__ */ new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= weekAgo;
        });
        break;
      case "month":
        const monthAgo = /* @__PURE__ */ new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime && quizDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate <= toDateTime;
          });
        }
        break;
    }
    setFilteredQuizzes(filtered);
  }, [dateFilter, quizzes, fromDate, toDate]);
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", role: "alert", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 sm:text-4xl", children: "APPSC Prelims Practice" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4", children: "Practice with carefully curated questions to prepare for APPSC Prelims" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 sm:mb-0", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-5 w-5 text-gray-500 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filter by date:" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 justify-center sm:justify-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "all" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Quizzes"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "today" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Today"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "week" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Week"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "month" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Month"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "custom" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Custom Range"
              ]
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] }),
      dateFilter !== "all" && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-gray-500 text-center sm:text-right", children: [
        "Showing ",
        filteredQuizzes.length,
        " ",
        filteredQuizzes.length === 1 ? "quiz" : "quizzes",
        " from ",
        dateFilter === "today" ? "today" : dateFilter === "week" ? "the past 7 days" : "the past 30 days"
      ] })
    ] }),
    filteredQuizzes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: "No quizzes available at the moment. Please check back later." }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1", children: filteredQuizzes.map((quiz) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleQuizClick(quiz.id),
        className: "bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all hover:shadow-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 truncate", children: quiz.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500 line-clamp-2", children: quiz.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800", children: [
                  quiz.totalQuestions,
                  " Questions"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800", children: [
                  quiz.timeInMinutes,
                  " Minutes"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 text-xs font-medium rounded-full 
                      ${quiz.difficulty === "easy" ? "bg-green-100 text-green-800" : quiz.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
                  children: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
            "Start Quiz ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
          ] }) })
        ]
      },
      quiz.id
    )) })
  ] }) });
};
const APPSCMainsPracticePage = ({ initialData }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) {
      const appscQuizzes = initialData.quizzes.filter(
        (quiz) => quiz.quizType === "mainsPractice" && quiz.examBoard === "appsc"
      );
      setQuizzes(appscQuizzes);
      setFilteredQuizzes(appscQuizzes);
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.quizzes) return;
    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("quizType", "==", "mainsPractice"),
          where("examBoard", "==", "appsc")
        );
        const querySnapshot = await getDocs(q);
        const quizData = [];
        querySnapshot.forEach((doc2) => {
          quizData.push({ id: doc2.id, ...doc2.data() });
        });
        setQuizzes(quizData);
        setFilteredQuizzes(quizData);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [isClient, initialData]);
  useEffect(() => {
    if (quizzes.length === 0) return;
    let filtered = [...quizzes];
    switch (dateFilter) {
      case "today":
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= today;
        });
        break;
      case "week":
        const weekAgo = /* @__PURE__ */ new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= weekAgo;
        });
        break;
      case "month":
        const monthAgo = /* @__PURE__ */ new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter((quiz) => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime && quizDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = quizzes.filter((quiz) => {
            const quizDate = quiz.createdAt.toDate();
            return quizDate <= toDateTime;
          });
        }
        break;
    }
    setFilteredQuizzes(filtered);
  }, [dateFilter, quizzes, fromDate, toDate]);
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", role: "alert", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 sm:text-4xl", children: "APPSC Mains Practice" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4", children: "Practice with detailed explanations for APPSC Mains preparation" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 sm:mb-0", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-5 w-5 text-gray-500 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filter by date:" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 justify-center sm:justify-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "all" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Quizzes"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "today" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Today"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "week" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Week"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "month" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "This Month"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "custom" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 mr-1" }),
                "Custom Range"
              ]
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] }),
      dateFilter !== "all" && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-gray-500 text-center sm:text-right", children: [
        "Showing ",
        filteredQuizzes.length,
        " ",
        filteredQuizzes.length === 1 ? "quiz" : "quizzes",
        " from ",
        dateFilter === "today" ? "today" : dateFilter === "week" ? "the past 7 days" : dateFilter === "month" ? "the past 30 days" : "the selected range"
      ] })
    ] }),
    filteredQuizzes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxs("p", { className: "text-lg text-gray-600", children: [
      "No quizzes available ",
      dateFilter !== "all" ? "for the selected date range" : "at the moment",
      ". Please check back later."
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1", children: filteredQuizzes.map((quiz) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleQuizClick(quiz.id),
        className: "bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all hover:shadow-lg",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 truncate", children: quiz.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500 line-clamp-2", children: quiz.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800", children: [
                  quiz.totalQuestions,
                  " Questions"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800", children: "Self-paced" })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 text-xs font-medium rounded-full 
                      ${quiz.difficulty === "easy" ? "bg-green-100 text-green-800" : quiz.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
                  children: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-indigo-600 hover:text-indigo-500", children: [
            "Start Practice ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
          ] }) })
        ]
      },
      quiz.id
    )) })
  ] }) });
};
const PrelimsPage = () => {
  const { examType = "upsc", paperId } = useParams();
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [mcQuestions, setMcQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  useEffect(() => {
    const fetchPaper = async () => {
      if (!paperId) return;
      try {
        setLoading(true);
        const paperDoc = await getDoc(doc(db, "pyqPapers", paperId));
        if (paperDoc.exists()) {
          const data = paperDoc.data();
          setSelectedPaper({
            id: paperDoc.id,
            title: data.title,
            year: data.year,
            examType: data.examType,
            paperType: data.paperType,
            chapters: data.chapters || []
          });
        } else {
          setError("Paper not found");
        }
      } catch (err) {
        console.error("Error fetching paper:", err);
        setError("Failed to load paper. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [paperId]);
  useEffect(() => {
    const fetchMCQuestions = async () => {
      if (!selectedPaper || !selectedChapter) return;
      try {
        setLoading(true);
        const q = query(
          collection(db, "prelimsMCQs"),
          where("paperId", "==", selectedPaper.id),
          where("chapterId", "==", selectedChapter.id)
        );
        const querySnapshot = await getDocs(q);
        const mcqData = [];
        querySnapshot.forEach((doc2) => {
          mcqData.push({ id: doc2.id, ...doc2.data() });
        });
        setMcQuestions(mcqData);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
      } catch (err) {
        console.error("Error fetching MCQs:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMCQuestions();
  }, [selectedPaper, selectedChapter]);
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };
  const handleOptionSelect = (optionIndex) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
  };
  const handleSubmit = () => {
    if (selectedOption === null || mcQuestions.length === 0) return;
    setIsCorrect(selectedOption === mcQuestions[currentQuestionIndex].correctOption);
    setShowResult(true);
  };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };
  if (loading && !selectedPaper) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-1/3" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxs("div", { className: "h-24 bg-white rounded-lg shadow p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded w-1/2" })
      ] }, i)) })
    ] }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: error }) })
    ] }) }) }) });
  }
  if (!selectedPaper) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-lg", children: [
    /* @__PURE__ */ jsx("div", { className: "px-4 py-5 border-b border-gray-200 sm:px-6", children: /* @__PURE__ */ jsxs("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: [
      selectedPaper.title,
      " (",
      selectedPaper.year,
      ")"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-5 sm:p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-base font-medium text-gray-900 mb-4", children: "Chapters" }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200 max-h-[400px] overflow-y-auto", children: selectedPaper.chapters.map((chapter) => /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => handleChapterSelect(chapter),
            className: `px-4 py-3 cursor-pointer hover:bg-gray-50 ${(selectedChapter == null ? void 0 : selectedChapter.id) === chapter.id ? "bg-blue-50" : ""}`,
            children: chapter.title
          },
          chapter.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "col-span-2", children: selectedChapter ? mcQuestions.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("h4", { className: "text-base font-medium text-gray-900", children: [
          "Question ",
          currentQuestionIndex + 1,
          " of ",
          mcQuestions.length
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg border border-gray-200", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-lg text-gray-900 mb-4",
                dangerouslySetInnerHTML: { __html: mcQuestions[currentQuestionIndex].question }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: mcQuestions[currentQuestionIndex].options.map((option, index) => /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => handleOptionSelect(index),
                className: `p-3 rounded-lg cursor-pointer border ${selectedOption === index ? showResult ? index === mcQuestions[currentQuestionIndex].correctOption ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50" : "border-blue-500 bg-blue-50" : showResult && index === mcQuestions[currentQuestionIndex].correctOption ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`,
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  showResult && /* @__PURE__ */ jsx("div", { className: "mr-2", children: index === mcQuestions[currentQuestionIndex].correctOption ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }) : selectedOption === index ? /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-red-500" }) : null }),
                  /* @__PURE__ */ jsx("span", { className: `${showResult && index === mcQuestions[currentQuestionIndex].correctOption ? "text-green-700" : showResult && selectedOption === index ? "text-red-700" : "text-gray-900"}`, children: option })
                ] })
              },
              index
            )) }),
            showResult && /* @__PURE__ */ jsx("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: isCorrect ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-6 w-6 text-green-500" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6 text-red-500" }) }),
              /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
                /* @__PURE__ */ jsx("h4", { className: `text-sm font-medium ${isCorrect ? "text-green-800" : "text-red-800"}`, children: isCorrect ? "Correct!" : "Incorrect" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "mt-2 text-sm text-gray-600",
                    dangerouslySetInnerHTML: { __html: mcQuestions[currentQuestionIndex].explanation }
                  }
                )
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handlePreviousQuestion,
                disabled: currentQuestionIndex === 0,
                className: `px-4 py-2 rounded-md ${currentQuestionIndex === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"}`,
                children: "Previous"
              }
            ),
            !showResult ? /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleSubmit,
                disabled: selectedOption === null,
                className: `px-4 py-2 rounded-md ${selectedOption === null ? "bg-blue-100 text-blue-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`,
                children: "Submit"
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleNextQuestion,
                disabled: currentQuestionIndex === mcQuestions.length - 1,
                className: `px-4 py-2 rounded-md ${currentQuestionIndex === mcQuestions.length - 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`,
                children: "Next"
              }
            )
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "mx-auto h-12 w-12 text-gray-400" }),
        /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No questions found" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "There are no questions available for this chapter yet." })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "mx-auto h-12 w-12 text-gray-400" }),
        /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No chapter selected" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Select a chapter from the list to view its questions." })
      ] }) })
    ] }) })
  ] }) }) });
};
const handleFirestoreError$2 = (error, operation) => {
  console.error(`Error during ${operation}:`, error);
  if (error instanceof FirestoreError) {
    console.error(`Firestore error code: ${error.code}`);
  }
  throw new Error(`Failed to ${operation}: ${error.message}`);
};
const getCourses = async () => {
  try {
    console.log("Fetching courses from Firestore...");
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    console.log(`Fetched ${snapshot.docs.length} courses`);
    return snapshot.docs.map((doc2) => {
      const data = doc2.data();
      return {
        id: doc2.id,
        ...data,
        examType: data.examType || "upsc"
        // Default to 'upsc' if examType is missing
      };
    });
  } catch (error) {
    handleFirestoreError$2(error, "fetch courses");
    return [];
  }
};
const createCourse = async (courseData) => {
  try {
    console.log("Creating new course with data:", courseData);
    const now = Date.now();
    const data = {
      ...courseData,
      createdAt: now,
      updatedAt: now
    };
    const coursesRef = collection(db, "courses");
    const docRef = await addDoc(coursesRef, data);
    console.log("Course created with ID:", docRef.id);
    return {
      id: docRef.id,
      ...data
    };
  } catch (error) {
    console.error("Error creating course:", error);
    handleFirestoreError$2(error, "create course");
    throw error;
  }
};
const updateCourse = async (id, courseData) => {
  try {
    const courseRef = doc(db, "courses", id);
    const updates = {
      ...courseData,
      updatedAt: Date.now()
    };
    await updateDoc(courseRef, updates);
  } catch (error) {
    handleFirestoreError$2(error, "update course");
    throw error;
  }
};
const deleteCourse = async (id) => {
  try {
    const courseRef = doc(db, "courses", id);
    await deleteDoc(courseRef);
  } catch (error) {
    handleFirestoreError$2(error, "delete course");
    throw error;
  }
};
const migrateCourseExamTypes = async () => {
  try {
    console.log("Starting course migration for examType field...");
    const coursesRef = collection(db, "courses");
    const snapshot = await getDocs(coursesRef);
    const updatePromises = snapshot.docs.filter((doc2) => !doc2.data().examType).map((doc2) => {
      var _a2;
      const courseRef = doc2.ref;
      const title = ((_a2 = doc2.data().title) == null ? void 0 : _a2.toLowerCase()) || "";
      let examType = "upsc";
      if (title.includes("tgpsc") || title.includes("telangana")) {
        examType = "tgpsc";
      } else if (title.includes("appsc") || title.includes("andhra")) {
        examType = "appsc";
      } else if (title.includes("current affairs") || title.includes("general")) {
        examType = "all";
      }
      return updateDoc(courseRef, {
        examType,
        updatedAt: Date.now()
      });
    });
    await Promise.all(updatePromises);
    console.log(`Migrated ${updatePromises.length} courses with examType field`);
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};
const getSampleCourses = () => {
  const now = Date.now();
  return [
    {
      id: "1",
      title: "Complete UPSC CSE Prelims Course",
      description: "Comprehensive preparation for UPSC Civil Services Examination Prelims with detailed coverage of all subjects.",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 9999,
      duration: "6 months",
      examType: "upsc",
      features: [
        "Complete subject coverage",
        "1000+ practice questions",
        "Mock tests with analysis",
        "Personalized mentoring"
      ],
      paymentLink: "https://example.com/pay/upsc-prelims-course",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "2",
      title: "UPSC CSE Mains Optional: History",
      description: "In-depth coverage of History optional for UPSC CSE Mains examination with expert guidance.",
      imageUrl: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 7999,
      duration: "4 months",
      examType: "upsc",
      features: [
        "Comprehensive study material",
        "Answer writing practice",
        "Previous years papers analysis",
        "Weekly tests"
      ],
      paymentLink: "https://example.com/pay/history-optional",
      createdAt: now - 864e5,
      updatedAt: now - 864e5
    },
    {
      id: "3",
      title: "Current Affairs Mastery Program",
      description: "Stay updated with the most relevant current affairs for UPSC and other competitive examinations.",
      imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 3999,
      duration: "3 months",
      examType: "all",
      features: [
        "Daily current affairs updates",
        "Monthly compilations",
        "Current affairs analysis",
        "Trend analysis for prelims and mains"
      ],
      paymentLink: "https://example.com/pay/current-affairs",
      createdAt: now - 1728e5,
      updatedAt: now - 1728e5
    },
    {
      id: "4",
      title: "Interview Preparation Course",
      description: "Comprehensive preparation for the UPSC CSE Personality Test (Interview) with mock interviews and feedback.",
      imageUrl: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 12999,
      duration: "2 months",
      examType: "upsc",
      features: [
        "Personalized DAF analysis",
        "5 mock interviews",
        "Expert feedback",
        "Group discussions"
      ],
      paymentLink: "https://example.com/pay/interview-prep",
      createdAt: now - 2592e5,
      updatedAt: now - 2592e5
    },
    {
      id: "5",
      title: "Ethics, Integrity & Aptitude Course",
      description: "Master the ethics paper (GS Paper IV) for UPSC CSE Mains with case studies and answer writing techniques.",
      imageUrl: "https://images.unsplash.com/photo-1605664042097-e2bd0cad0783?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 5999,
      duration: "3 months",
      examType: "upsc",
      features: [
        "Complete ethical theories coverage",
        "100+ case studies",
        "Answer writing practice",
        "Weekly assignments"
      ],
      paymentLink: "https://example.com/pay/ethics-course",
      createdAt: now - 3456e5,
      updatedAt: now - 3456e5
    },
    {
      id: "6",
      title: "CSAT Preparation Course",
      description: "Focused preparation for CSAT (Civil Services Aptitude Test) with conceptual clarity and problem-solving techniques.",
      imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 4999,
      duration: "2 months",
      examType: "upsc",
      features: [
        "Comprehensive aptitude coverage",
        "Reasoning techniques",
        "Reading comprehension strategies",
        "Time management skills"
      ],
      paymentLink: "https://example.com/pay/csat-course",
      createdAt: now - 432e6,
      updatedAt: now - 432e6
    },
    {
      id: "7",
      title: "TGPSC Group-I Prelims Course",
      description: "Complete preparation for Telangana State Public Service Commission Group-I preliminary examination.",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 8999,
      duration: "5 months",
      examType: "tgpsc",
      features: [
        "Telangana specific syllabus coverage",
        "State-focused current affairs",
        "Previous year papers analysis",
        "Mock tests with analysis"
      ],
      paymentLink: "https://example.com/pay/tgpsc-prelims",
      createdAt: now - 5184e5,
      updatedAt: now - 5184e5
    },
    {
      id: "8",
      title: "APPSC Group-I Mains Course",
      description: "Comprehensive preparation for Andhra Pradesh Public Service Commission Group-I mains examination.",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 11999,
      duration: "6 months",
      examType: "appsc",
      features: [
        "Andhra Pradesh specific syllabus",
        "Answer writing practice",
        "Regional language support",
        "Expert mentoring"
      ],
      paymentLink: "https://example.com/pay/appsc-mains",
      createdAt: now - 6048e5,
      updatedAt: now - 6048e5
    },
    {
      id: "9",
      title: "TGPSC Group-II Preparation",
      description: "Focused preparation for TGPSC Group-II examination with comprehensive coverage.",
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 6999,
      duration: "4 months",
      examType: "tgpsc",
      features: [
        "Group-II specific syllabus",
        "Reasoning and quantitative aptitude",
        "General studies for Telangana",
        "Weekly assessments"
      ],
      paymentLink: "https://example.com/pay/tgpsc-group2",
      createdAt: now - 6912e5,
      updatedAt: now - 6912e5
    }
  ];
};
const CourseImage = ({
  imagePath,
  width,
  height,
  className = "",
  alt = "Course image"
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const [alternatePathTried, setAlternatePathTried] = useState(false);
  if (!imagePath) {
    console.error("No image path provided to CourseImage component");
    return null;
  }
  console.log("CourseImage component processing path:", imagePath);
  let cleanPath = "";
  if (imagePath.includes("firebasestorage.googleapis.com")) {
    cleanPath = imagePath.replace("https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/", "").replace(/\?alt=media.*$/, "").replace(/%2F/g, "/").replace(/^courses\//, "");
    console.log("Cleaned Firebase URL path:", cleanPath);
  } else if (imagePath.startsWith("data:")) {
    console.log("Using data URL directly");
    return /* @__PURE__ */ jsx(
      "img",
      {
        src: imagePath,
        alt,
        width,
        height,
        className
      }
    );
  } else {
    cleanPath = imagePath.replace(/^courses\//, "");
    console.log("Using non-Firebase URL path:", cleanPath);
  }
  if (cleanPath.includes("THREEATOMS_SOCIAL_LOGO")) {
    console.log("Using direct social logo endpoint");
    return /* @__PURE__ */ jsx(
      "img",
      {
        src: "/api/social-logo",
        alt,
        width,
        height,
        className
      }
    );
  }
  const proxyUrl = `/api/course-image/${cleanPath}?originalUrl=${encodeURIComponent(imagePath)}`;
  console.log("Final image proxy URL:", proxyUrl);
  const handleImageError = (e) => {
    console.error(`Error loading course image (attempt ${errorCount + 1}), trying fallback`);
    setErrorCount((prev) => prev + 1);
    if (errorCount === 0) {
      e.target.src = imagePath;
    } else if (errorCount === 1 && !alternatePathTried && (cleanPath.includes(" ") || cleanPath.includes("(") || cleanPath.includes(")"))) {
      setAlternatePathTried(true);
      const fixedPath = cleanPath.replace(/ /g, "_").replace(/[()]/g, "");
      console.log("Trying alternate path format:", fixedPath);
      e.target.src = `/api/course-image/${fixedPath}?originalUrl=${encodeURIComponent(imagePath)}`;
    } else if (errorCount === 2 && alternatePathTried || errorCount === 1 && !alternatePathTried) {
      console.log("All standard paths failed, trying debug endpoint");
      e.target.src = `/api/debug-image?imagePath=courses/${cleanPath}`;
    } else {
      e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
      console.error("All image loading attempts failed for:", imagePath);
    }
  };
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: proxyUrl,
      alt,
      width,
      height,
      className,
      onError: handleImageError
    }
  );
};
const CoursesPage = ({ initialData }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedExam, setSelectedExam] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.courses) {
      setCourses(initialData.courses);
      setLoading(false);
    } else {
      setCourses(getSampleCourses());
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.courses) return;
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getCourses();
        if (coursesData.length > 0) {
          setCourses(coursesData);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses(getSampleCourses());
        setError("Using sample data due to connection issues.");
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchCourses, 100);
    return () => clearTimeout(timer);
  }, [isClient, initialData]);
  useEffect(() => {
    if (selectedExam === "all") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) => course.examType === selectedExam || course.examType === "all"
      );
      setFilteredCourses(filtered);
    }
  }, [courses, selectedExam]);
  const handleExamFilter = (exam) => {
    setSelectedExam(exam);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };
  if (loading && isClient) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "Our Courses" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Comprehensive courses designed to help you succeed in your UPSC and other competitive examinations journey." })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-8", children: error }),
    /* @__PURE__ */ jsx("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Filter by Exam:" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleExamFilter("all"),
            className: `px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedExam === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
            children: "All Courses"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleExamFilter("upsc"),
            className: `px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedExam === "upsc" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
            children: "UPSC"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleExamFilter("tgpsc"),
            className: `px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedExam === "tgpsc" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
            children: "TGPSC"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleExamFilter("appsc"),
            className: `px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedExam === "appsc" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
            children: "APPSC"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredCourses.map((course) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 flex flex-col transform hover:-translate-y-1",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100", children: [
            /* @__PURE__ */ jsx(
              CourseImage,
              {
                imagePath: course.imageUrl,
                alt: course.title,
                className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1.5 text-xs font-bold rounded-full shadow-md ${course.examType === "upsc" ? "bg-blue-500 text-white" : course.examType === "tgpsc" ? "bg-emerald-500 text-white" : course.examType === "appsc" ? "bg-purple-500 text-white" : "bg-gray-700 text-white"}`, children: course.examType.toUpperCase() }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-4", children: /* @__PURE__ */ jsx("div", { className: "bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm font-medium text-gray-700", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 mr-1.5 text-blue-500" }),
              /* @__PURE__ */ jsx("span", { children: course.duration })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-grow", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300", children: course.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-5 flex-grow leading-relaxed text-sm", children: course.description }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-gray-800 mb-3 flex items-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full mr-2" }),
                "Key Features"
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
                course.features.slice(0, 3).map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start group/item", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 mr-3 group-hover/item:bg-green-200 transition-colors", children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 text-green-600" }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 leading-relaxed", children: feature })
                ] }, index)),
                course.features.length > 3 && /* @__PURE__ */ jsxs("li", { className: "text-xs text-blue-600 ml-8 font-medium", children: [
                  "+",
                  course.features.length - 3,
                  " more benefits"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto border-t border-gray-100 pt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: formatPrice(course.price) }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full", children: "One-time payment" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                course.scheduleUrl ? /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: course.scheduleUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-xl inline-flex items-center justify-center transition-all duration-300 border border-gray-200 hover:border-gray-300 group/btn",
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: "Schedule" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-xl inline-flex items-center justify-center transition-all duration-300 border border-gray-200 hover:border-gray-300 group/btn",
                    onClick: () => window.alert(`Schedule for ${course.title} will be available soon!`),
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: "Schedule" })
                    ]
                  }
                ),
                course.paymentLink ? /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: course.paymentLink,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl inline-flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group/btn",
                    children: [
                      /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" }),
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: "Enroll Now" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl inline-flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group/btn",
                    onClick: () => window.alert(`Enrollment for ${course.title} will be available soon!`),
                    children: [
                      /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" }),
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: "Enroll Now" })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ]
      },
      course.id
    )) }),
    filteredCourses.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: selectedExam === "all" ? "No courses available at the moment. Please check back later." : `No courses available for ${selectedExam.toUpperCase()} at the moment.` }) })
  ] });
};
const handleFirestoreError$1 = (error, operation) => {
  console.error(`Error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};
const getBlogPosts = async () => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    handleFirestoreError$1(error, "fetch blog posts");
    return [];
  }
};
const getPublishedPosts = async () => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    handleFirestoreError$1(error, "fetch published posts");
    return [];
  }
};
const getPublishedBlogPosts = async () => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("published", "==", true),
      where("isBlog", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    console.warn("Direct blog query failed, falling back to client-side filtering:", error);
    const allPosts = await getPublishedPosts();
    return allPosts.filter((post) => post.isBlog === true);
  }
};
const getCurrentAffairsPosts = async () => {
  try {
    const postsRef = collection(db, "posts");
    try {
      const q = query(
        postsRef,
        where("published", "==", true),
        where("isCurrentAffair", "==", true),
        orderBy("currentAffairDate", "desc")
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
      if (posts.length > 0) {
        return posts;
      }
      const qSimple = query(
        postsRef,
        where("published", "==", true),
        where("isCurrentAffair", "==", true)
      );
      const snapshotSimple = await getDocs(qSimple);
      const postsSimple = snapshotSimple.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
      if (postsSimple.length > 0) {
        return postsSimple.sort((a, b) => {
          const dateA = a.currentAffairDate || 0;
          const dateB = b.currentAffairDate || 0;
          return dateB - dateA;
        });
      }
    } catch (indexError) {
      console.error("Error with indexed query:", indexError);
    }
    console.log("No current affairs found, returning sample data");
    return getSampleCurrentAffairs$1();
  } catch (error) {
    console.error("Error fetching current affairs:", error);
    return getSampleCurrentAffairs$1();
  }
};
const getSampleCurrentAffairs$1 = () => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1e3;
  return [
    {
      id: "sample-ca-1",
      title: "Union Budget 2024-25 Highlights",
      slug: "union-budget-2024-25-highlights",
      content: "<p>Finance Minister presented the Union Budget 2024-25 in Parliament today. Key highlights include...</p>",
      excerpt: "Key highlights from the Union Budget 2024-25 focusing on economic growth, tax reforms, and infrastructure development.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - day * 1,
      createdAt: now - day * 1,
      updatedAt: now - day * 1
    },
    {
      id: "sample-ca-2",
      title: "Supreme Court Judgment on Electoral Bonds",
      slug: "supreme-court-judgment-electoral-bonds",
      content: "<p>The Supreme Court today delivered its verdict on the electoral bonds scheme...</p>",
      excerpt: "Analysis of the Supreme Court's landmark judgment on the electoral bonds scheme and its implications.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - day * 3,
      createdAt: now - day * 3,
      updatedAt: now - day * 3
    },
    {
      id: "sample-ca-3",
      title: "G20 Summit 2024: Key Outcomes",
      slug: "g20-summit-2024-key-outcomes",
      content: "<p>The G20 Summit concluded with several important decisions and agreements...</p>",
      excerpt: "Summary of the key outcomes from the G20 Summit 2024 and their global implications.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - day * 5,
      createdAt: now - day * 5,
      updatedAt: now - day * 5
    },
    {
      id: "sample-ca-4",
      title: "New National Education Policy Implementation Update",
      slug: "new-national-education-policy-implementation-update",
      content: "<p>The Ministry of Education released an update on the implementation of the National Education Policy...</p>",
      excerpt: "Latest updates on the implementation status of the National Education Policy across various states.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - day * 7,
      createdAt: now - day * 7,
      updatedAt: now - day * 7
    },
    {
      id: "sample-ca-5",
      title: "Important Cabinet Decisions This Week",
      slug: "important-cabinet-decisions-this-week",
      content: "<p>The Union Cabinet approved several key decisions this week including...</p>",
      excerpt: "Summary of important decisions taken by the Union Cabinet this week affecting various sectors.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - day * 10,
      createdAt: now - day * 10,
      updatedAt: now - day * 10
    }
  ];
};
const getBlogPost = async (id) => {
  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleFirestoreError$1(error, "fetch blog post");
    return null;
  }
};
const getBlogPostBySlug = async (slug) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc2 = snapshot.docs[0];
    return { id: doc2.id, ...doc2.data() };
  } catch (error) {
    handleFirestoreError$1(error, "fetch blog post by slug");
    return null;
  }
};
const createBlogPost = async (data) => {
  try {
    const postsRef = collection(db, "posts");
    const slug = data.slug || slugify(data.title, { lower: true, strict: true });
    const now = Timestamp.now().toMillis();
    const slugCheck = await getBlogPostBySlug(slug);
    if (slugCheck) {
      throw new Error("A post with this slug already exists");
    }
    const post = {
      slug,
      createdAt: now,
      updatedAt: now
    };
    Object.entries(data).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        post[key] = value;
      }
    });
    console.log("Creating post with data:", post);
    const docRef = await addDoc(postsRef, post);
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError$1(error, "create blog post");
    return "";
  }
};
const updateBlogPost = async (id, data) => {
  try {
    console.log(`Attempting to update blog post with ID: ${id}`, data);
    if (!id) {
      throw new Error("Post ID is required for updating");
    }
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Post with ID ${id} does not exist`);
    }
    const updates = {
      updatedAt: Timestamp.now().toMillis()
    };
    Object.entries(data).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        updates[key] = value;
      }
    });
    if (data.title && !data.slug) {
      updates.slug = slugify(data.title, { lower: true, strict: true });
      const slugCheck = await getBlogPostBySlug(updates.slug);
      if (slugCheck && slugCheck.id !== id) {
        throw new Error("A post with this slug already exists");
      }
    }
    console.log(`Updating document with data:`, updates);
    await updateDoc(docRef, updates);
    console.log(`Document successfully updated`);
  } catch (error) {
    console.error("Error updating blog post:", error);
    if (error instanceof FirestoreError) {
      console.error(`Firestore error code: ${error.code}, message: ${error.message}`);
      handleFirestoreError$1(error, "update blog post");
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Unknown error updating blog post: ${error}`);
    }
  }
};
const deleteBlogPost = async (id) => {
  try {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError$1(error, "delete blog post");
  }
};
const getCategories = async () => {
  try {
    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, orderBy("name"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    handleFirestoreError$1(error, "fetch categories");
    return [];
  }
};
const createCategory = async (name) => {
  try {
    const categoriesRef = collection(db, "categories");
    const slug = slugify(name, { lower: true, strict: true });
    const q = query(categoriesRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error("A category with this name already exists");
    }
    const docRef = await addDoc(categoriesRef, { name, slug });
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError$1(error, "create category");
    return "";
  }
};
const updateCategory = async (id, name) => {
  try {
    const categoriesRef = collection(db, "categories");
    const slug = slugify(name, { lower: true, strict: true });
    const q = query(categoriesRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty && snapshot.docs[0].id !== id) {
      throw new Error("A category with this name already exists");
    }
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, { name, slug });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError$1(error, "update category");
  }
};
const deleteCategory = async (id) => {
  try {
    const docRef = doc(db, "categories", id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError$1(error, "delete category");
  }
};
const CurrentAffairsPage = ({ initialData }) => {
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.upscDates && initialData.tgpscDates && initialData.appscDates) {
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    if (initialData && initialData.upscDates && initialData.tgpscDates && initialData.appscDates) return;
    const fetchCurrentAffairs = async () => {
      try {
        setLoading(true);
        const posts = await getCurrentAffairsPosts();
        setCurrentAffairs(posts);
        setError(null);
      } catch (err) {
        console.error("Error fetching current affairs:", err);
        setError("Failed to load current affairs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchCurrentAffairs, 100);
    return () => clearTimeout(timer);
  }, [isClient, initialData]);
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date not available";
    return format(new Date(timestamp), "dd MMMM yyyy");
  };
  if (loading && isClient) return /* @__PURE__ */ jsx(LoadingScreen, {});
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Current Affairs" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Stay updated with the latest current affairs and developments for competitive examinations." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-600 p-4", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "UPSC Current Affairs" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Daily current affairs and news analysis for UPSC Civil Services Examination." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [
              /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4 mr-1" }),
              /* @__PURE__ */ jsx("span", { children: "Daily Updates" })
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/current-affairs/upsc",
                className: "inline-flex items-center text-blue-600 hover:text-blue-800",
                children: [
                  "View All",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-1" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-green-600 p-4", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "TGPSC Current Affairs" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Daily current affairs and news analysis for Telangana Public Service Commission." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [
              /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4 mr-1" }),
              /* @__PURE__ */ jsx("span", { children: "Daily Updates" })
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/current-affairs/tgpsc",
                className: "inline-flex items-center text-green-600 hover:text-green-800",
                children: [
                  "View All",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-1" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-purple-600 p-4", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "APPSC Current Affairs" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Daily current affairs and news analysis for Andhra Pradesh Public Service Commission." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [
              /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4 mr-1" }),
              /* @__PURE__ */ jsx("span", { children: "Daily Updates" })
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/current-affairs/appsc",
                className: "inline-flex items-center text-purple-600 hover:text-purple-800",
                children: [
                  "View All",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-1" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-6 border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 text-blue-600 mr-2" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Why Current Affairs Matter" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Staying updated with current affairs is crucial for success in competitive examinations. Our daily compilations cover important national and international events, government policies, appointments, awards, and more." }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800 mb-2", children: "Comprehensive Coverage" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "All important events and developments covered in detail" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800 mb-2", children: "Exam-Focused" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Content tailored specifically for each examination" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800 mb-2", children: "Daily Updates" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Fresh content added every day for continuous learning" })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: error }) }),
    currentAffairs.length === 0 && !loading && !error ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg", children: "No current affairs available yet." }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Latest Current Affairs" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: currentAffairs.map((post) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/notes/${post.slug}`,
          className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-blue-600 font-medium mr-3", children: formatDate(post.currentAffairDate) }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: "CURRENT AFFAIRS" })
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 text-blue-600 flex-shrink-0" })
          ]
        },
        post.id
      )) })
    ] }) }) })
  ] });
};
const getCurrentAffairsByExam = async (examType) => {
  try {
    console.log(`Fetching current affairs for exam type: ${examType}`);
    const postsRef = collection(db, "posts");
    const examFilter = examType === "all" ? [] : [where("examType", "==", examType)];
    console.log("Using exam filter:", examFilter);
    try {
      const q = query(
        postsRef,
        where("published", "==", true),
        where("isCurrentAffair", "==", true),
        ...examFilter,
        orderBy("currentAffairDate", "desc")
      );
      console.log("Executing query with ordering...");
      const snapshot = await getDocs(q);
      console.log(`Query returned ${snapshot.docs.length} documents`);
      const posts = snapshot.docs.map((doc2) => {
        const data = doc2.data();
        console.log(`Post ID: ${doc2.id}, Title: ${data.title}, isCurrentAffair: ${data.isCurrentAffair}, examType: ${data.examType}, date: ${data.currentAffairDate}`);
        return { id: doc2.id, ...data };
      });
      if (posts.length > 0) {
        console.log(`Returning ${posts.length} posts with ordering`);
        return posts;
      }
      console.log("No posts found with ordering query, trying simpler query...");
      const qSimple = query(
        postsRef,
        where("published", "==", true),
        where("isCurrentAffair", "==", true),
        ...examFilter
      );
      console.log("Executing simpler query without ordering...");
      const snapshotSimple = await getDocs(qSimple);
      console.log(`Simple query returned ${snapshotSimple.docs.length} documents`);
      const postsSimple = snapshotSimple.docs.map((doc2) => {
        const data = doc2.data();
        console.log(`Simple query - Post ID: ${doc2.id}, Title: ${data.title}, isCurrentAffair: ${data.isCurrentAffair}, examType: ${data.examType}, date: ${data.currentAffairDate}`);
        return { id: doc2.id, ...data };
      });
      if (postsSimple.length > 0) {
        console.log(`Returning ${postsSimple.length} posts from simpler query`);
        return postsSimple.sort((a, b) => {
          const dateA = a.currentAffairDate || 0;
          const dateB = b.currentAffairDate || 0;
          return dateB - dateA;
        });
      }
      console.log("No posts found with simpler query either.");
    } catch (indexError) {
      console.error("Error with indexed query:", indexError);
    }
    console.log("No current affairs found, returning sample data");
    return getSampleCurrentAffairs(examType);
  } catch (error) {
    console.error("Error fetching current affairs:", error);
    return getSampleCurrentAffairs(examType);
  }
};
const getCurrentAffairsDates = async (examType) => {
  try {
    const posts = await getCurrentAffairsByExam(examType);
    const dateMap = /* @__PURE__ */ new Map();
    posts.forEach((post) => {
      if (post.currentAffairDate) {
        const date = new Date(post.currentAffairDate);
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const dateTimestamp = new Date(dateString).getTime();
        const count = dateMap.get(dateTimestamp) || 0;
        dateMap.set(dateTimestamp, count + 1);
      }
    });
    return Array.from(dateMap.entries()).map(([date, count]) => ({ date, count })).sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error("Error fetching current affairs dates:", error);
    return [];
  }
};
const getCurrentAffairsByDate = async (date, examType) => {
  try {
    const posts = await getCurrentAffairsByExam(examType);
    return posts.filter((post) => {
      if (!post.currentAffairDate) return false;
      const postDate = new Date(post.currentAffairDate);
      const targetDate = new Date(date);
      return postDate.getFullYear() === targetDate.getFullYear() && postDate.getMonth() === targetDate.getMonth() && postDate.getDate() === targetDate.getDate();
    });
  } catch (error) {
    console.error("Error fetching current affairs by date:", error);
    return [];
  }
};
const getSampleCurrentAffairs = (examType) => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1e3;
  const samplePosts = [
    // UPSC Current Affairs
    {
      id: "sample-upsc-ca-1",
      title: "Union Budget 2024-25 Highlights",
      slug: "union-budget-2024-25-highlights",
      content: "<p>Finance Minister presented the Union Budget 2024-25 in Parliament today. Key highlights include...</p>",
      excerpt: "Key highlights from the Union Budget 2024-25 focusing on economic growth, tax reforms, and infrastructure development.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      examType: "upsc",
      currentAffairDate: now - day * 1,
      createdAt: now - day * 1,
      updatedAt: now - day * 1
    },
    {
      id: "sample-upsc-ca-2",
      title: "National Education Policy Implementation",
      slug: "national-education-policy-implementation",
      content: "<p>The government has announced new measures to accelerate the implementation of the National Education Policy...</p>",
      excerpt: "New measures announced to accelerate the implementation of the National Education Policy across states.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      examType: "upsc",
      currentAffairDate: now - day * 2,
      createdAt: now - day * 2,
      updatedAt: now - day * 2
    },
    {
      id: "sample-upsc-ca-3",
      title: "India-EU Trade Agreement",
      slug: "india-eu-trade-agreement",
      content: "<p>India and the European Union have finalized a comprehensive trade agreement after years of negotiations...</p>",
      excerpt: "India and the European Union finalize a comprehensive trade agreement to boost bilateral trade and investment.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      examType: "upsc",
      currentAffairDate: now - day * 2,
      createdAt: now - day * 2,
      updatedAt: now - day * 2
    },
    // TGPSC Current Affairs
    {
      id: "sample-tgpsc-ca-1",
      title: "Telangana Irrigation Project Inauguration",
      slug: "telangana-irrigation-project-inauguration",
      content: "<p>The Chief Minister of Telangana inaugurated a major irrigation project that will benefit farmers across several districts...</p>",
      excerpt: "Telangana CM inaugurates major irrigation project benefiting farmers across multiple districts.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      examType: "tgpsc",
      currentAffairDate: now - day * 1,
      createdAt: now - day * 1,
      updatedAt: now - day * 1
    },
    {
      id: "sample-tgpsc-ca-2",
      title: "Telangana Digital Literacy Program",
      slug: "telangana-digital-literacy-program",
      content: "<p>The Telangana government has launched a comprehensive digital literacy program aimed at rural areas...</p>",
      excerpt: "Telangana government launches comprehensive digital literacy program targeting rural areas.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      examType: "tgpsc",
      currentAffairDate: now - day * 3,
      createdAt: now - day * 3,
      updatedAt: now - day * 3
    },
    // APPSC Current Affairs
    {
      id: "sample-appsc-ca-1",
      title: "Andhra Pradesh Industrial Policy 2024",
      slug: "andhra-pradesh-industrial-policy-2024",
      content: "<p>The Andhra Pradesh government has announced a new industrial policy to attract investments and create jobs...</p>",
      excerpt: "Andhra Pradesh government announces new industrial policy to boost investment and job creation.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      examType: "appsc",
      currentAffairDate: now - day * 1,
      createdAt: now - day * 1,
      updatedAt: now - day * 1
    },
    {
      id: "sample-appsc-ca-2",
      title: "Andhra Pradesh Healthcare Initiatives",
      slug: "andhra-pradesh-healthcare-initiatives",
      content: "<p>The state government has launched several healthcare initiatives to improve medical services in rural areas...</p>",
      excerpt: "Andhra Pradesh government launches healthcare initiatives to improve medical services in rural areas.",
      categories: [],
      author: "Admin",
      published: true,
      isCurrentAffair: true,
      examType: "appsc",
      currentAffairDate: now - day * 4,
      createdAt: now - day * 4,
      updatedAt: now - day * 4
    }
  ];
  if (examType !== "all") {
    return samplePosts.filter((post) => post.examType === examType);
  }
  return samplePosts;
};
const CurrentAffairsDates = ({ examType, title, color }) => {
  const [dates, setDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!isClient) return;
    const fetchDates = async () => {
      try {
        setLoading(true);
        const result = await getCurrentAffairsDates(examType);
        setDates(result);
        setFilteredDates(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${examType} current affairs dates:`, err);
        setError(`Failed to load ${examType.toUpperCase()} current affairs dates. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchDates, 100);
    return () => clearTimeout(timer);
  }, [isClient, examType]);
  useEffect(() => {
    if (dates.length === 0) return;
    let filtered = [...dates];
    switch (dateFilter) {
      case "today":
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        filtered = dates.filter((dateItem) => {
          const itemDate = new Date(dateItem.date);
          return itemDate >= today && itemDate <= todayEnd;
        });
        break;
      case "week":
        const weekAgo = /* @__PURE__ */ new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = dates.filter((dateItem) => {
          const itemDate = new Date(dateItem.date);
          return itemDate >= weekAgo;
        });
        break;
      case "month":
        const monthAgo = /* @__PURE__ */ new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = dates.filter((dateItem) => {
          const itemDate = new Date(dateItem.date);
          return itemDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = dates.filter((dateItem) => {
            const itemDate = new Date(dateItem.date);
            return itemDate >= fromDateTime && itemDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = dates.filter((dateItem) => {
            const itemDate = new Date(dateItem.date);
            return itemDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = dates.filter((dateItem) => {
            const itemDate = new Date(dateItem.date);
            return itemDate <= toDateTime;
          });
        }
        break;
    }
    setFilteredDates(filtered);
  }, [dateFilter, dates, fromDate, toDate]);
  const formatDate = (timestamp) => {
    return format(new Date(timestamp), "dd MMMM yyyy");
  };
  if (loading && isClient) return /* @__PURE__ */ jsx(LoadingScreen, {});
  const getBgColorClass = () => {
    switch (color) {
      case "blue":
        return "bg-blue-600";
      case "green":
        return "bg-green-600";
      case "purple":
        return "bg-purple-600";
      default:
        return "bg-blue-600";
    }
  };
  const getTextColorClass = () => {
    switch (color) {
      case "blue":
        return "text-blue-600";
      case "green":
        return "text-green-600";
      case "purple":
        return "text-purple-600";
      default:
        return "text-blue-600";
    }
  };
  const getHoverColorClass = () => {
    switch (color) {
      case "blue":
        return "hover:bg-blue-50";
      case "green":
        return "hover:bg-green-50";
      case "purple":
        return "hover:bg-purple-50";
      default:
        return "hover:bg-blue-50";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: title }),
      /* @__PURE__ */ jsxs("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: [
        "Select a date to view the current affairs for ",
        title,
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 sm:mb-0", children: [
          /* @__PURE__ */ jsx(CalendarDays, { className: "h-5 w-5 text-gray-500 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filter dates:" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 justify-center sm:justify-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "all" ? `${getTextColorClass()} bg-opacity-10 border` : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Dates"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "today" ? `${getTextColorClass()} bg-opacity-10 border` : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(CalendarDays, { className: "h-3.5 w-3.5 mr-1" }),
                "Today"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "week" ? `${getTextColorClass()} bg-opacity-10 border` : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(CalendarDays, { className: "h-3.5 w-3.5 mr-1" }),
                "This Week"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "month" ? `${getTextColorClass()} bg-opacity-10 border` : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(CalendarDays, { className: "h-3.5 w-3.5 mr-1" }),
                "This Month"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === "custom" ? `${getTextColorClass()} bg-opacity-10 border` : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx(CalendarDays, { className: "h-3.5 w-3.5 mr-1" }),
                "Custom Range"
              ]
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] }),
      dateFilter !== "all" && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-gray-500 text-center sm:text-right", children: [
        "Showing ",
        filteredDates.length,
        " ",
        filteredDates.length === 1 ? "date" : "dates",
        " ",
        dateFilter === "today" ? "from today" : dateFilter === "week" ? "from the past 7 days" : dateFilter === "month" ? "from the past 30 days" : "in the selected range"
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: error }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `${getBgColorClass()} p-4`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(CalendarDays, { className: "h-5 w-5 text-white mr-2" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "Available Dates" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: filteredDates.length === 0 && !loading && !error ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-lg", children: [
        "No current affairs available",
        dateFilter !== "all" ? " for the selected date range" : "",
        " for ",
        title,
        "."
      ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredDates.map((dateItem) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/current-affairs/${examType}/${dateItem.date}`,
          className: `flex items-center justify-between p-4 border border-gray-200 rounded-lg ${getHoverColorClass()} transition-colors`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: `${getTextColorClass()} font-medium`, children: formatDate(dateItem.date) }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
                dateItem.count,
                " ",
                dateItem.count === 1 ? "article" : "articles"
              ] })
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { className: `w-5 h-5 ${getTextColorClass()} flex-shrink-0` })
          ]
        },
        dateItem.date
      )) }) })
    ] })
  ] });
};
const UPSCCurrentAffairsPage = ({ initialData }) => {
  return /* @__PURE__ */ jsx(
    CurrentAffairsDates,
    {
      examType: "upsc",
      title: "UPSC Current Affairs",
      color: "blue",
      initialData
    }
  );
};
const TGPSCCurrentAffairsPage = ({ initialData }) => {
  return /* @__PURE__ */ jsx(
    CurrentAffairsDates,
    {
      examType: "tgpsc",
      title: "TGPSC Current Affairs",
      color: "green",
      initialData
    }
  );
};
const APPSCCurrentAffairsPage = ({ initialData }) => {
  return /* @__PURE__ */ jsx(
    CurrentAffairsDates,
    {
      examType: "appsc",
      title: "APPSC Current Affairs",
      color: "purple",
      initialData
    }
  );
};
const CurrentAffairsDetail = ({ examType, title, color }) => {
  const { dateParam } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      if (!dateParam) {
        setError("Invalid date parameter");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const date2 = parseInt(dateParam, 10);
        if (isNaN(date2)) {
          setError("Invalid date format");
          return;
        }
        const result = await getCurrentAffairsByDate(date2, examType);
        setPosts(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${examType} current affairs for date:`, err);
        setError(`Failed to load ${examType.toUpperCase()} current affairs. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [dateParam, examType]);
  const formatDate = (timestamp) => {
    return format(new Date(timestamp), "dd MMMM yyyy");
  };
  if (loading) return /* @__PURE__ */ jsx(LoadingScreen, {});
  const getTextColorClass = () => {
    switch (color) {
      case "blue":
        return "text-blue-600";
      case "green":
        return "text-green-600";
      case "purple":
        return "text-purple-600";
      default:
        return "text-blue-600";
    }
  };
  const getBgColorClass = () => {
    switch (color) {
      case "blue":
        return "bg-blue-600";
      case "green":
        return "bg-green-600";
      case "purple":
        return "bg-purple-600";
      default:
        return "bg-blue-600";
    }
  };
  const date = dateParam ? parseInt(dateParam, 10) : 0;
  const formattedDate = !isNaN(date) ? formatDate(date) : "Invalid Date";
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => navigate(`/current-affairs/${examType}`),
        className: "inline-flex items-center text-gray-600 hover:text-gray-900",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
          "Back to ",
          title,
          " Dates"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(Calendar, { className: `${getTextColorClass()} h-5 w-5 mr-2` }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-medium", children: formattedDate })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: error }) }),
    posts.length === 0 && !loading && !error ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 bg-white rounded-lg shadow-md", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg", children: "No current affairs available for this date." }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-6", children: posts.map((post) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `${getBgColorClass()} p-4`, children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: post.title }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: post.excerpt }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/current-affairs/${examType}/${post.currentAffairDate}/${post.slug}`,
            className: `inline-flex items-center ${getTextColorClass()} hover:underline`,
            children: [
              "Read Full Article",
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 ml-1 transform rotate-180" })
            ]
          }
        )
      ] })
    ] }, post.id)) })
  ] });
};
const UPSCCurrentAffairsDetailPage = ({ initialData }) => {
  return /* @__PURE__ */ jsx(
    CurrentAffairsDetail,
    {
      examType: "upsc",
      title: "UPSC Current Affairs",
      color: "blue",
      initialData
    }
  );
};
const TGPSCCurrentAffairsDetailPage = ({ initialData }) => {
  return /* @__PURE__ */ jsx(
    CurrentAffairsDetail,
    {
      examType: "tgpsc",
      title: "TGPSC Current Affairs",
      color: "green",
      initialData
    }
  );
};
const CurrentAffairsDebug = () => {
  const [loading, setLoading] = useState(true);
  const [upscPosts, setUpscPosts] = useState([]);
  const [tgpscPosts, setTgpscPosts] = useState([]);
  const [appscPosts, setAppscPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [upscData, tgpscData, appscData] = await Promise.all([
          getCurrentAffairsByExam("upsc"),
          getCurrentAffairsByExam("tgpsc"),
          getCurrentAffairsByExam("appsc")
        ]);
        setUpscPosts(upscData);
        setTgpscPosts(tgpscData);
        setAppscPosts(appscData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    return format(new Date(timestamp), "dd MMM yyyy");
  };
  if (loading) return /* @__PURE__ */ jsx(LoadingScreen, {});
  const renderPost = (post) => /* @__PURE__ */ jsxs("div", { className: "border p-4 rounded-lg mb-4 bg-white shadow-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: post.title }),
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 my-1", children: [
      "Date: ",
      formatDate(post.currentAffairDate),
      " | Type: ",
      post.examType
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
        /* @__PURE__ */ jsx("strong", { children: "isCurrentAffair:" }),
        " ",
        post.isCurrentAffair ? "Yes" : "No"
      ] }),
      post.currentAffairDate && /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
        /* @__PURE__ */ jsx("strong", { children: "currentAffairDate:" }),
        " ",
        post.currentAffairDate,
        " (",
        formatDate(post.currentAffairDate),
        ")"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
        /* @__PURE__ */ jsx("strong", { children: "Slug:" }),
        " ",
        post.slug
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-col space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Debug Links:" }),
      /* @__PURE__ */ jsxs("div", { className: "ml-4 flex flex-col space-y-1", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/notes/${post.slug}`,
            className: "text-blue-600 hover:underline",
            children: [
              "/notes/",
              post.slug
            ]
          }
        ),
        post.examType && post.currentAffairDate && /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/current-affairs/${post.examType}/${post.currentAffairDate}`,
            className: "text-green-600 hover:underline",
            children: [
              "/current-affairs/",
              post.examType,
              "/",
              post.currentAffairDate
            ]
          }
        ),
        post.examType && post.currentAffairDate && /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/current-affairs/${post.examType}/${post.currentAffairDate}/${post.slug}`,
            className: "text-purple-600 hover:underline",
            children: [
              "/current-affairs/",
              post.examType,
              "/",
              post.currentAffairDate,
              "/",
              post.slug
            ]
          }
        )
      ] })
    ] })
  ] }, post.id);
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-center mb-8", children: "Current Affairs Debug Page" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold mb-4", children: [
          "UPSC Current Affairs (",
          upscPosts.length,
          ")"
        ] }),
        upscPosts.length > 0 ? upscPosts.map(renderPost) : /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No UPSC current affairs found." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold mb-4", children: [
          "TGPSC Current Affairs (",
          tgpscPosts.length,
          ")"
        ] }),
        tgpscPosts.length > 0 ? tgpscPosts.map(renderPost) : /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No TGPSC current affairs found." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-purple-50 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold mb-4", children: [
          "APPSC Current Affairs (",
          appscPosts.length,
          ")"
        ] }),
        appscPosts.length > 0 ? appscPosts.map(renderPost) : /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No APPSC current affairs found." })
      ] })
    ] })
  ] });
};
const APPSCCurrentAffairsDetailPage = ({ initialData }) => {
  return /* @__PURE__ */ jsx(
    CurrentAffairsDetail,
    {
      examType: "appsc",
      title: "APPSC Current Affairs",
      color: "purple",
      initialData
    }
  );
};
const CurrentAffairsRawData = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("published", "==", true));
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map((doc2) => ({
          id: doc2.id,
          ...doc2.data()
        }));
        setAllPosts(fetchedPosts);
        const currentAffairsPosts = fetchedPosts.filter((post) => post.isCurrentAffair === true);
        setPosts(currentAffairsPosts);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllPosts();
  }, []);
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    return format(new Date(timestamp), "dd MMM yyyy");
  };
  if (loading) return /* @__PURE__ */ jsx(LoadingScreen, {});
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-center mb-8", children: "Error" }),
      /* @__PURE__ */ jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded", children: error })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-center mb-8", children: "Current Affairs Raw Data" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-4 rounded-lg mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-4", children: "Database Stats" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc ml-6", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          "Total Posts: ",
          allPosts.length
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Current Affairs Posts: ",
          posts.length
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 p-4 rounded-lg mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-4", children: "Firebase Index Instructions" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Your Firestore query requires a composite index. You need to create the following index in the Firebase console:" }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded border", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Collection: ",
          /* @__PURE__ */ jsx("strong", { children: "posts" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Fields to index:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc ml-6", children: [
          /* @__PURE__ */ jsx("li", { children: "published (Ascending)" }),
          /* @__PURE__ */ jsx("li", { children: "isCurrentAffair (Ascending)" }),
          /* @__PURE__ */ jsx("li", { children: "examType (Ascending)" }),
          /* @__PURE__ */ jsx("li", { children: "currentAffairDate (Descending)" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-4", children: "To create this index:" }),
      /* @__PURE__ */ jsxs("ol", { className: "list-decimal ml-6", children: [
        /* @__PURE__ */ jsx("li", { children: "Go to the Firebase Console" }),
        /* @__PURE__ */ jsx("li", { children: "Navigate to Firestore Database" }),
        /* @__PURE__ */ jsx("li", { children: 'Click on "Indexes" tab' }),
        /* @__PURE__ */ jsx("li", { children: 'Click "Create Index"' }),
        /* @__PURE__ */ jsx("li", { children: "Add the fields as listed above" }),
        /* @__PURE__ */ jsx("li", { children: 'Click "Create"' })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold mb-4", children: [
      "Current Affairs Posts (",
      posts.length,
      ")"
    ] }),
    posts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-6", children: posts.map((post) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: post.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-300 text-sm mt-1", children: [
          "ID: ",
          post.id
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-700", children: "Basic Info:" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-sm text-gray-600 ml-4", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Slug:" }),
                " ",
                post.slug
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Published:" }),
                " ",
                post.published ? "Yes" : "No"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Author:" }),
                " ",
                post.author
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-700", children: "Current Affairs Info:" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-sm text-gray-600 ml-4", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Is Current Affair:" }),
                " ",
                post.isCurrentAffair ? "Yes" : "No"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Exam Type:" }),
                " ",
                post.examType || "Not set"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Current Affair Date:" }),
                " ",
                post.currentAffairDate ? `${post.currentAffairDate} (${formatDate(post.currentAffairDate)})` : "Not set"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t pt-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-700 mb-2", children: "Links:" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/notes/${post.slug}`,
                className: "text-blue-600 hover:underline",
                children: [
                  "Notes Link: /notes/",
                  post.slug
                ]
              }
            ) }),
            post.examType && post.currentAffairDate && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/current-affairs/${post.examType}/${post.currentAffairDate}/${post.slug}`,
                className: "text-green-600 hover:underline",
                children: [
                  "Current Affairs Link: /current-affairs/",
                  post.examType,
                  "/",
                  post.currentAffairDate,
                  "/",
                  post.slug
                ]
              }
            ) })
          ] })
        ] })
      ] })
    ] }, post.id)) }) : /* @__PURE__ */ jsx("div", { className: "bg-white p-6 rounded-lg shadow-md", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-center text-gray-700", children: "No current affairs posts found in your database." }) })
  ] });
};
const testFirestoreConnection = async () => {
  try {
    const collections = ["courses", "blogs", "messages", "quizzes"];
    for (const collectionName of collections) {
      try {
        console.log(`Attempting to query ${collectionName} collection...`);
        const q = query(collection(db, collectionName), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return {
            success: true,
            message: `Successfully connected to Firestore and retrieved data from ${collectionName} collection.`,
            details: {
              collectionName,
              documentCount: querySnapshot.size,
              sampleDocId: querySnapshot.docs[0].id
            }
          };
        }
      } catch (err) {
        console.log(`Error querying ${collectionName}: ${err}`);
      }
    }
    return {
      success: true,
      message: "Successfully connected to Firestore, but no documents found in any collection.",
      details: { collections }
    };
  } catch (error) {
    console.error("Error testing Firestore connection:", error);
    return {
      success: false,
      message: "Failed to connect to Firestore.",
      details: error
    };
  }
};
const testStorageConnection = async () => {
  try {
    const storageRef = ref(storage$1);
    const result = await listAll(storageRef);
    return {
      success: true,
      message: "Successfully connected to Firebase Storage.",
      details: {
        prefixes: result.prefixes.length,
        items: result.items.length
      }
    };
  } catch (error) {
    console.error("Error testing Storage connection:", error);
    return {
      success: false,
      message: "Failed to connect to Firebase Storage.",
      details: error
    };
  }
};
const testAuthConnection = async () => {
  try {
    const currentUser = auth$1.currentUser;
    const isSignedIn = !!currentUser;
    return {
      success: true,
      message: "Successfully connected to Firebase Authentication.",
      details: {
        isSignedIn,
        currentUser: currentUser ? { uid: currentUser.uid, email: currentUser.email } : null
      }
    };
  } catch (error) {
    console.error("Error testing Auth connection:", error);
    return {
      success: false,
      message: "Failed to connect to Firebase Authentication.",
      details: error
    };
  }
};
const testAllFirebaseConnections = async () => {
  const firestoreResult = await testFirestoreConnection();
  const storageResult = await testStorageConnection();
  const authResult = await testAuthConnection();
  return {
    firestore: firestoreResult,
    storage: storageResult,
    auth: authResult
  };
};
const checkFirebaseEnvVars = () => {
  const envVars = {
    "VITE_FIREBASE_API_KEY": true,
    "VITE_FIREBASE_AUTH_DOMAIN": true,
    "VITE_FIREBASE_PROJECT_ID": true,
    "VITE_FIREBASE_STORAGE_BUCKET": true,
    "VITE_FIREBASE_MESSAGING_SENDER_ID": true,
    "VITE_FIREBASE_APP_ID": true
  };
  console.log("Firebase environment variables check:");
  Object.entries(envVars).forEach(([key, isSet]) => {
    console.log(`${key}: ${isSet ? "Set ✓" : "Not set ✗"}`);
  });
  return envVars;
};
const FirebaseConnectionTest = () => {
  const [loading, setLoading] = useState(true);
  const [envVarsStatus, setEnvVarsStatus] = useState({});
  const [connectionResults, setConnectionResults] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const runTests = async () => {
      try {
        setLoading(true);
        const envVars = checkFirebaseEnvVars();
        setEnvVarsStatus(envVars);
        const results = await testAllFirebaseConnections();
        setConnectionResults(results);
      } catch (err) {
        console.error("Error running Firebase connection tests:", err);
        setError("Failed to run Firebase connection tests. See console for details.");
      } finally {
        setLoading(false);
      }
    };
    runTests();
  }, []);
  const renderEnvVarsStatus = () => {
    return /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-gray-50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2", children: "Environment Variables Status" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: Object.entries(envVarsStatus).map(([key, isSet]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("span", { className: `inline-block w-6 h-6 rounded-full mr-2 flex items-center justify-center ${isSet ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, children: isSet ? "✓" : "✗" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: key })
      ] }, key)) })
    ] });
  };
  const renderConnectionResults = () => {
    if (!connectionResults) return null;
    return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: Object.entries(connectionResults).map(([service, result]) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `p-4 rounded-lg ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`,
        children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-medium mb-1 flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: `inline-block w-6 h-6 rounded-full mr-2 flex items-center justify-center ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, children: result.success ? "✓" : "✗" }),
            service.charAt(0).toUpperCase() + service.slice(1)
          ] }),
          /* @__PURE__ */ jsx("p", { className: result.success ? "text-green-800" : "text-red-800", children: result.message }),
          result.details && /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxs("details", { className: "text-sm", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer font-medium", children: "Details" }),
            /* @__PURE__ */ jsx("pre", { className: "mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs", children: JSON.stringify(result.details, null, 2) })
          ] }) })
        ]
      },
      service
    )) });
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Firebase Connection Test" }),
    loading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center p-12", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }),
      /* @__PURE__ */ jsx("span", { className: "ml-3", children: "Testing Firebase connections..." })
    ] }) : error ? /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg", children: error }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      renderEnvVarsStatus(),
      renderConnectionResults(),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2", children: "What does this mean?" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Environment Variables:" }),
            " Checks if the Firebase config variables are defined in your .env file."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Firestore:" }),
            " Tests connection to Firestore database."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Storage:" }),
            " Tests connection to Firebase Storage."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Auth:" }),
            " Tests connection to Firebase Authentication."
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm", children: "If any tests fail, check your .env file and make sure all Firebase configuration variables are correctly set." })
      ] })
    ] })
  ] });
};
function MinimalInitializerPlugin({ content }) {
  const [editor] = useLexicalComposerContext();
  const [hasInitialized, setHasInitialized] = useState(false);
  const initContentRef = useRef(content);
  useEffect(() => {
    if (hasInitialized) {
      console.log("⚠️ Skipping re-initialization to protect keyboard input");
      return;
    }
    const shouldInitialize = !hasInitialized && content !== initContentRef.current;
    if (!shouldInitialize) {
      if (!hasInitialized) {
        setHasInitialized(true);
        console.log("✅ Minimal Initializer: Using existing content, marking as initialized");
      }
      return;
    }
    console.log("🔄 Minimal Initializer: ONE-TIME initialization with content:", content.substring(0, 50));
    const timeoutId = setTimeout(() => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        if (content && content.trim()) {
          if (content.includes("<") && content.includes(">")) {
            try {
              const parser = new DOMParser();
              const dom = parser.parseFromString(content, "text/html");
              const nodes = $generateNodesFromDOM(editor, dom);
              if (nodes.length > 0) {
                root.append(...nodes);
              } else {
                const paragraph = $createParagraphNode();
                paragraph.append($createTextNode(content.replace(/<[^>]*>/g, "")));
                root.append(paragraph);
              }
            } catch (error) {
              console.warn("HTML parsing failed, using plain text");
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(content));
              root.append(paragraph);
            }
          } else {
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(content));
            root.append(paragraph);
          }
        } else {
          const paragraph = $createParagraphNode();
          root.append(paragraph);
        }
      });
      setHasInitialized(true);
      console.log("✅ Minimal Initializer: Initialization complete - keyboard should work normally");
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [editor, content, hasInitialized]);
  return null;
}
function UltraSimpleOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  const handleChange = useCallback((editorState) => {
    editorState.read(() => {
      try {
        const htmlString = $generateHtmlFromNodes(editor);
        onChange(htmlString);
        console.log("📝 IMMEDIATE Content changed:", htmlString.substring(0, 30) + "...");
      } catch (error) {
        console.error("Error generating HTML:", error);
      }
    });
  }, [editor, onChange]);
  return /* @__PURE__ */ jsx(OnChangePlugin, { onChange: handleChange });
}
const MinimalLexicalTest = ({
  content,
  onChange,
  placeholder = "Type here to test..."
}) => {
  const initialConfig = {
    namespace: "MinimalTest",
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic"
      },
      heading: {
        h1: "text-2xl font-bold",
        h2: "text-xl font-bold",
        h3: "text-lg font-bold"
      },
      list: {
        ol: "list-decimal list-inside",
        ul: "list-disc list-inside",
        listitem: "mb-1"
      },
      quote: "border-l-4 border-gray-300 pl-4 italic",
      link: "text-blue-600 underline"
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode
    ],
    onError: (error) => {
      console.error("Minimal Lexical error:", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "minimal-lexical-test border-2 border-red-300 rounded-lg p-4 bg-red-50", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-2 text-sm font-bold text-red-700", children: "🔬 MINIMAL LEXICAL TEST - Check keyboard input here" }),
    /* @__PURE__ */ jsx("div", { className: "border border-gray-300 rounded bg-white", children: /* @__PURE__ */ jsxs(LexicalComposer, { initialConfig, children: [
      /* @__PURE__ */ jsx(MinimalInitializerPlugin, { content }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          RichTextPlugin,
          {
            contentEditable: /* @__PURE__ */ jsx(
              ContentEditable,
              {
                className: "min-h-[200px] p-4 outline-none text-base leading-normal resize-none focus:ring-2 focus:ring-blue-500",
                style: { caretColor: "#1f2937" },
                spellCheck: false
              }
            ),
            placeholder: /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 text-gray-400 pointer-events-none select-none", children: placeholder }),
            ErrorBoundary: LexicalErrorBoundary
          }
        ),
        /* @__PURE__ */ jsx(HistoryPlugin, {}),
        /* @__PURE__ */ jsx(UltraSimpleOnChangePlugin, { onChange })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-red-600", children: "Instructions: Click in the editor above and type. Each character should appear on the same line. If you see line breaks after each character, the issue is confirmed." })
  ] });
};
const EditorDebugTest = () => {
  const [content, setContent] = useState("<p>Initial test content</p>");
  const [debugInfo, setDebugInfo] = useState([]);
  const handleContentChange = (newContent) => {
    setContent(newContent);
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    setDebugInfo((prev) => [
      `${timestamp}: Content changed (${newContent.length} chars)`,
      ...prev.slice(0, 9)
      // Keep last 10 entries
    ]);
  };
  const clearDebugInfo = () => {
    setDebugInfo([]);
  };
  const resetContent = () => {
    setContent("<p>Reset test content</p>");
    setDebugInfo([]);
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "🐛 Lexical Editor Debug Page" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "This page isolates the Lexical editor to test keyboard input behavior. The editor below should allow normal typing without creating line breaks on every keypress." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: resetContent,
            className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
            children: "Reset Content"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: clearDebugInfo,
            className: "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600",
            children: "Clear Debug Log"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        MinimalLexicalTest,
        {
          content,
          onChange: handleContentChange,
          placeholder: "Click here and type normally. Test: fd as l j fdk as"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "📊 Debug Information" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: "Current Content:" }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-3 rounded border text-sm font-mono max-h-32 overflow-auto", children: content })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: "Change Log:" }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-3 rounded border text-sm max-h-32 overflow-auto", children: debugInfo.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No changes yet" }) : debugInfo.map((info, index) => /* @__PURE__ */ jsx("div", { className: "mb-1", children: info }, index)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-yellow-800 mb-3", children: "🧪 Testing Instructions" }),
      /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-2 text-yellow-700", children: [
        /* @__PURE__ */ jsx("li", { children: "Click in the red-bordered editor above" }),
        /* @__PURE__ */ jsx("li", { children: 'Type normally: "hello world"' }),
        /* @__PURE__ */ jsx("li", { children: "Check if text appears on the same line" }),
        /* @__PURE__ */ jsx("li", { children: "Try pressing Enter to create intentional line breaks" }),
        /* @__PURE__ */ jsx("li", { children: "Try typing after pressing Enter" }),
        /* @__PURE__ */ jsx("li", { children: "Watch the debug log for any unusual behavior" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-yellow-100 rounded", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-yellow-800", children: "Expected Behavior: Normal typing should keep text on the same line unless Enter is pressed." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-700 mt-1", children: "Problem Behavior: Each keypress creates a new line/paragraph." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-blue-800 mb-3", children: "🔍 Diagnostic Information" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-blue-700", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Browser:" }),
          " ",
          navigator.userAgent
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "URL:" }),
          " ",
          window.location.href
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Time:" }),
          " ",
          (/* @__PURE__ */ new Date()).toLocaleString()
        ] })
      ] })
    ] })
  ] }) });
};
const EXAM_TYPES = {
  "upsc-notes": "UPSC",
  "appsc-notes": "APPSC",
  "tgpsc-notes": "TGPSC",
  "notes": "All"
};
const BlogIndex = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];
  const examType = EXAM_TYPES[currentPath] || "All";
  const filterCategoriesByExamType = (categories2, examType2) => {
    return categories2;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPublishedPosts(),
          getCategories()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    fetchData();
  }, []);
  const getPostsByCategory = (categoryId) => {
    return posts.filter((post) => post.categories.includes(categoryId));
  };
  const getRandomPostsForCategory = (categoryId) => {
    const categoryPosts = getPostsByCategory(categoryId);
    const maxPosts = Math.min(categoryPosts.length, Math.floor(Math.random() * 6) + 10);
    return categoryPosts.slice(0, maxPosts);
  };
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  const filteredCategories = filterCategoriesByExamType(categories);
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-8", children: examType === "All" ? "Notes" : `${examType} Notes` }),
    filteredCategories.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-xl text-gray-600", children: [
        "No categories found for ",
        examType
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4", children: [
        "Please create categories specific to ",
        examType,
        " in the admin panel."
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6", children: filteredCategories.map((category) => {
      const categoryPosts = getPostsByCategory(category.id);
      const displayPosts = getRandomPostsForCategory(category.id);
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 break-inside-avoid-column hover:shadow-xl transition-shadow duration-300",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "mr-2 text-blue-500 text-2xl font-bold", children: categoryPosts.length }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: category.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsx("ul", { className: "space-y-1 mb-6", children: displayPosts.map((post) => /* @__PURE__ */ jsx("li", { className: "py-1", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/notes/${post.slug}`,
                  className: "text-blue-600 hover:text-blue-800 hover:underline flex items-start",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mr-2 mt-1", children: "•" }),
                    /* @__PURE__ */ jsx("span", { children: post.title })
                  ]
                }
              ) }, post.id)) }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: `/category/${category.slug}`,
                  className: "text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow",
                  children: "Explore More"
                }
              )
            ] })
          ]
        },
        category.id
      );
    }) })
  ] });
};
const BlogsIndex = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const POSTS_PER_PAGE = 12;
  const totalPosts = blogs.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const displayedBlogs = blogs.slice(startIndex, endIndex);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!isClient) return;
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const blogPosts = await getPublishedBlogPosts();
        setBlogs(blogPosts);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    const timer = setTimeout(fetchBlogs, 100);
    return () => clearTimeout(timer);
  }, [isClient]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };
  if (loading && isClient) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "Our Blog" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Insights, tips, and updates from our team to help you on your journey." }),
      totalPosts > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-gray-500", children: [
        "Showing ",
        startIndex + 1,
        "-",
        Math.min(endIndex, totalPosts),
        " of ",
        totalPosts,
        " posts"
      ] })
    ] }),
    blogs.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-600", children: "No blog posts available yet." }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-500", children: "Check back soon for our latest updates and insights!" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: displayedBlogs.map((blog) => /* @__PURE__ */ jsxs(
        "article",
        {
          className: "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col",
          children: [
            blog.featuredImage && /* @__PURE__ */ jsx("div", { className: "aspect-w-16 aspect-h-9 overflow-hidden", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: blog.featuredImage,
                alt: blog.title,
                className: "w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-grow", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-sm text-gray-500 mb-3", children: [
                /* @__PURE__ */ jsx("time", { dateTime: new Date(blog.createdAt).toISOString(), children: new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) }),
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: blog.author })
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2", children: /* @__PURE__ */ jsx(Link, { to: `/blogs/${blog.slug}`, children: blog.title }) }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4 flex-grow line-clamp-3", children: blog.excerpt }),
              blog.tags && blog.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [
                blog.tags.slice(0, 3).map((tag, index) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
                    children: tag
                  },
                  index
                )),
                blog.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600", children: [
                  "+",
                  blog.tags.length - 3,
                  " more"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/blogs/${blog.slug}`,
                  className: "inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group",
                  children: [
                    "Read More",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })
                      }
                    )
                  ]
                }
              ) })
            ] })
          ]
        },
        blog.id
      )) }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 mt-12", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handlePageChange(currentPage - 1),
            disabled: currentPage === 1,
            className: `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-blue-600"}`,
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
              "Previous"
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1", children: getPageNumbers().map((pageNum, index) => pageNum === "..." ? /* @__PURE__ */ jsx("span", { className: "px-3 py-2 text-gray-400", children: "..." }, index) : /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(pageNum),
            className: `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum ? "bg-blue-600 text-white" : "text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-600"}`,
            children: pageNum
          },
          index
        )) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handlePageChange(currentPage + 1),
            disabled: currentPage === totalPages,
            className: `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-blue-600"}`,
            children: [
              "Next",
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
            ]
          }
        )
      ] })
    ] })
  ] });
};
const updateMetaTags$1 = (title, description, imageUrl) => {
  if (typeof window === "undefined") return;
  document.title = `${title} | Epitome IAS`;
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute("content", description);
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute("content", title);
  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement("meta");
    ogDescription.setAttribute("property", "og:description");
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute("content", description);
  if (imageUrl) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute("content", imageUrl);
  }
};
const BlogPost = ({ isCurrentAffair: isCurrentAffairProp, isBlog: isBlogProp, examType: examTypeProp, initialData }) => {
  var _a2;
  const { slug, dateParam } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.post) {
      setPost(initialData.post);
      setCategories(initialData.categories || []);
      setAllPosts(initialData.allPosts || []);
      setCurrentAffairs(initialData.currentAffairs || []);
      if (initialData.post.categories) {
        const initialExpandedState = {};
        initialData.post.categories.forEach((catId) => {
          initialExpandedState[catId] = true;
        });
        setExpandedCategories(initialExpandedState);
      }
      updateMetaTags$1(
        initialData.post.title,
        initialData.post.excerpt || "Read this informative article from Epitome IAS",
        initialData.post.featuredImage
      );
      setLoading(false);
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!slug) return;
        if (isCurrentAffairProp && examTypeProp && dateParam) {
          console.log(`Fetching current affair article: ${slug} for exam ${examTypeProp} on date ${dateParam}`);
          const [post2, categoriesResult, currentAffairsData] = await Promise.all([
            getBlogPostBySlug(slug),
            getCategories(),
            getCurrentAffairsPosts()
          ]);
          if (post2) {
            setPost(post2);
            setCategories(categoriesResult);
            setAllPosts([]);
            setCurrentAffairs(currentAffairsData);
            const initialExpandedState = {};
            post2.categories.forEach((catId) => {
              initialExpandedState[catId] = true;
            });
            setExpandedCategories(initialExpandedState);
            updateMetaTags$1(
              post2.title,
              post2.excerpt || "Read this informative article from Epitome IAS",
              post2.featuredImage
            );
          }
        } else {
          const [post2, categoriesResult, postsData, currentAffairsData] = await Promise.all([
            getBlogPostBySlug(slug),
            getCategories(),
            getPublishedPosts(),
            getCurrentAffairsPosts()
          ]);
          if (post2) {
            setPost(post2);
            setCategories(categoriesResult);
            setAllPosts(postsData);
            setCurrentAffairs(currentAffairsData);
            const initialExpandedState = {};
            post2.categories.forEach((catId) => {
              initialExpandedState[catId] = true;
            });
            setExpandedCategories(initialExpandedState);
            updateMetaTags$1(
              post2.title,
              post2.excerpt || "Read this informative article from Epitome IAS",
              post2.featuredImage
            );
          }
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, [isClient, slug, isCurrentAffairProp, examTypeProp, dateParam]);
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        document.title = "Epitome IAS";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute("content", "Epitome IAS - Your learning partner for UPSC, TGPSC and APPSC competitive exams.");
        }
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute("content", "Epitome IAS");
        }
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute("content", "Epitome IAS - Your learning partner for competitive exams.");
        }
      }
    };
  }, []);
  useEffect(() => {
    if (!isClient) return;
    let scrollTimer;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [isClient]);
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  const getPostsByCategory = (categoryId) => {
    return allPosts.filter((p) => p.categories.includes(categoryId));
  };
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date not available";
    return format(new Date(timestamp), "dd MMMM yyyy");
  };
  if (loading && isClient) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  if (!post) {
    return /* @__PURE__ */ jsx("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Note Not Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "The note you're looking for doesn't exist." }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/notes",
          className: "text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow",
          children: "Back to Notes"
        }
      )
    ] }) });
  }
  const isCurrentAffair = isCurrentAffairProp || (post == null ? void 0 : post.isCurrentAffair) || false;
  return /* @__PURE__ */ jsx("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: `${isBlogProp || post.isBlog ? "flex justify-center" : "lg:flex lg:gap-8"}`, children: [
    !(isBlogProp || post.isBlog) && /* @__PURE__ */ jsx("div", { className: "hidden lg:block lg:w-1/4", children: isCurrentAffair ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-4 border border-gray-200 sticky top-24", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Current Affairs" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: currentAffairs.map((affair) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: affair.examType ? `/current-affairs/${affair.examType}/${affair.currentAffairDate}/${affair.slug}` : `/notes/${affair.slug}`,
          className: `block p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors ${affair.id === post.id ? "bg-blue-50 border-blue-200" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500 mb-1", children: [
              /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4 mr-1" }),
              /* @__PURE__ */ jsx("span", { children: formatDate(affair.currentAffairDate) })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: `text-sm font-medium ${affair.id === post.id ? "text-blue-600" : "text-gray-800"}`, children: affair.title })
          ]
        },
        affair.id
      )) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-md p-4 border border-gray-200 sticky top-24", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: categories.filter((category) => post.categories.includes(category.id)).map((category) => /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-100 pb-2", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => toggleCategory(category.id),
          className: "flex items-center justify-between w-full text-left px-2 py-2 rounded-md hover:bg-gray-50",
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800", children: category.name }),
            expandedCategories[category.id] ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-gray-500" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-gray-500" })
          ]
        }
      ),
      expandedCategories[category.id] && /* @__PURE__ */ jsx("div", { className: "mt-1 ml-4 space-y-1", children: getPostsByCategory(category.id).map((categoryPost) => /* @__PURE__ */ jsx(
        Link,
        {
          to: `/notes/${categoryPost.slug}`,
          className: `block py-1 text-sm ${categoryPost.id === post.id ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}`,
          children: categoryPost.title
        },
        categoryPost.id
      )) })
    ] }, category.id)) }) }) }),
    /* @__PURE__ */ jsxs("div", { className: `${isBlogProp || post.isBlog ? "max-w-4xl w-full" : "lg:w-3/4"}`, children: [
      /* @__PURE__ */ jsxs("article", { className: "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200", children: [
        post.featuredImage && /* @__PURE__ */ jsx("div", { className: "aspect-w-16 aspect-h-9", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: post.featuredImage,
            alt: post.title,
            className: "object-cover w-full h-full"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 lg:p-10", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6", children: isCurrentAffairProp && examTypeProp ? /* @__PURE__ */ jsxs(Link, { to: `/current-affairs/${examTypeProp}`, className: "text-blue-600 hover:text-blue-800", children: [
            examTypeProp.toUpperCase(),
            " Current Affairs"
          ] }) : isBlogProp || post.isBlog ? /* @__PURE__ */ jsx(Link, { to: "/blogs", className: "text-blue-600 hover:text-blue-800", children: "Blog" }) : /* @__PURE__ */ jsx(Link, { to: "/notes", className: "text-blue-600 hover:text-blue-800", children: post.categories.length > 0 ? ((_a2 = categories.find((c) => c.id === post.categories[0])) == null ? void 0 : _a2.name) || "Notes" : "Notes" }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8", children: post.title }),
          /* @__PURE__ */ jsx("div", { className: "prose prose-blue md:prose-lg lg:prose-xl max-w-none mb-8", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: post.content } }) }),
          post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-8 border-t border-gray-200", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 tracking-wide uppercase mb-3", children: "Tags" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: post.tags.map((tag, index) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800",
                children: tag
              },
              index
            )) })
          ] })
        ] })
      ] }),
      !(isBlogProp || post.isBlog) && /* @__PURE__ */ jsxs(Fragment, { children: [
        mobileSidebarOpen && /* @__PURE__ */ jsx(
          "div",
          {
            className: "lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40",
            onClick: () => setMobileSidebarOpen(false)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: `lg:hidden fixed left-0 top-0 h-full w-80 bg-white shadow-lg border-r border-gray-200 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`, children: /* @__PURE__ */ jsxs("div", { className: "p-4 pt-24", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setMobileSidebarOpen(false),
              className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors",
              children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          ),
          isCurrentAffair ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Current Affairs" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: currentAffairs.map((affair) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: affair.examType ? `/current-affairs/${affair.examType}/${affair.currentAffairDate}/${affair.slug}` : `/notes/${affair.slug}`,
                className: `block p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors ${affair.id === post.id ? "bg-blue-50 border-blue-200" : ""}`,
                onClick: () => setMobileSidebarOpen(false),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500 mb-1", children: [
                    /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4 mr-1" }),
                    /* @__PURE__ */ jsx("span", { children: formatDate(affair.currentAffairDate) })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: `text-sm font-medium ${affair.id === post.id ? "text-blue-600" : "text-gray-800"}`, children: affair.title })
                ]
              },
              affair.id
            )) })
          ] }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: categories.filter((category) => post.categories.includes(category.id)).map((category) => /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-100 pb-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => toggleCategory(category.id),
                className: "flex items-center justify-between w-full text-left px-2 py-2 rounded-md hover:bg-gray-50",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800", children: category.name }),
                  expandedCategories[category.id] ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-gray-500" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-gray-500" })
                ]
              }
            ),
            expandedCategories[category.id] && /* @__PURE__ */ jsx("div", { className: "mt-1 ml-4 space-y-1", children: getPostsByCategory(category.id).map((categoryPost) => /* @__PURE__ */ jsx(
              Link,
              {
                to: `/notes/${categoryPost.slug}`,
                className: `block py-1 text-sm ${categoryPost.id === post.id ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}`,
                onClick: () => setMobileSidebarOpen(false),
                children: categoryPost.title
              },
              categoryPost.id
            )) })
          ] }, category.id)) }) })
        ] }) })
      ] }),
      !(isBlogProp || post.isBlog) && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMobileSidebarOpen(!mobileSidebarOpen),
          className: `lg:hidden fixed top-1/2 left-6 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 ${isScrolling ? "opacity-0 pointer-events-none" : "opacity-100"}`,
          children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: mobileSidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"
            }
          ) })
        }
      )
    ] })
  ] }) });
};
const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPublishedPosts(),
          getCategories()
        ]);
        const foundCategory = categoriesData.find((c) => c.slug === categorySlug);
        setCategory(foundCategory || null);
        if (foundCategory) {
          const filteredPosts = postsData.filter(
            (post) => post.categories.includes(foundCategory.id)
          );
          setPosts(filteredPosts);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    fetchData();
  }, [categorySlug]);
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  if (!category) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Category Not Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "The category you're looking for doesn't exist." }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/notes",
          className: "text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200",
          children: "Back to Notes"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/notes",
          className: "inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6",
          children: "← Back to All Categories"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: [
          category.name,
          " Notes"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ml-4 text-blue-500 text-xl font-bold", children: posts.length })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6", children: posts.map((post) => /* @__PURE__ */ jsx(
      "article",
      {
        className: "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 break-inside-avoid-column hover:shadow-xl transition-shadow duration-300",
        children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-sm text-gray-500 mb-2", children: [
            /* @__PURE__ */ jsx("time", { dateTime: new Date(post.createdAt).toISOString(), children: new Date(post.createdAt).toLocaleDateString() }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsx("span", { children: post.author })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: `/${post.slug}`, className: "block mt-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900 hover:text-blue-600", children: post.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-600 line-clamp-3", children: post.excerpt })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
            Link,
            {
              to: `/${post.slug}`,
              className: "text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow",
              children: "Read more"
            }
          ) })
        ] })
      },
      post.id
    )) })
  ] });
};
const Login$1 = () => {
  var _a2, _b, _c;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = ((_b = (_a2 = location.state) == null ? void 0 : _a2.from) == null ? void 0 : _b.pathname) || "/";
  const adminAccessDenied = ((_c = location.state) == null ? void 0 : _c.adminAccessDenied) || false;
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  useEffect(() => {
    if (adminAccessDenied) {
      setError("You do not have admin privileges. This area is restricted to administrators only.");
    }
  }, [adminAccessDenied]);
  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error2) {
      if (error2 instanceof Error) {
        setError(error2.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to your account" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Access your quizzes, track your progress, and more" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: error }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-6", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: handleGoogleSignIn,
        disabled: loading,
        className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400",
        children: loading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
          ] }),
          "Processing..."
        ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 mr-2", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(
            "path",
            {
              fill: "currentColor",
              d: "M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            }
          ) }),
          "Sign in with Google"
        ] })
      }
    ) })
  ] }) });
};
const QuizStats = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    uniqueUsers: 0,
    averageScore: 0,
    uniqueQuizzes: 0
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const attemptsRef = collection(db, "quizAttempts");
        const q = userId ? query(attemptsRef, where("userId", "==", userId)) : query(attemptsRef);
        const snapshot = await getDocs(q);
        const attempts = snapshot.docs.map((doc2) => doc2.data());
        const uniqueUsers = new Set(attempts.map((a) => a.userId).filter(Boolean)).size;
        const uniqueQuizzes = new Set(attempts.map((a) => a.quizId).filter(Boolean)).size;
        let totalScore = 0;
        let validScores = 0;
        attempts.forEach((a) => {
          if (a.score !== void 0 && a.totalQuestions > 0) {
            totalScore += a.score / a.totalQuestions * 100;
            validScores++;
          }
        });
        setStats({
          totalAttempts: attempts.length,
          uniqueUsers,
          averageScore: validScores > 0 ? Math.round(totalScore / validScores) : 0,
          uniqueQuizzes
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load quiz statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userId]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-24", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: [
      error,
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "ml-2 text-sm underline hover:text-red-800",
          children: "Retry"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Quiz Statistics" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-indigo-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 bg-indigo-100 rounded-md p-2", children: /* @__PURE__ */ jsx(Award, { className: "h-5 w-5 text-indigo-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-500", children: "Total Attempts" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-900", children: stats.totalAttempts })
        ] })
      ] }) }),
      !userId && /* @__PURE__ */ jsx("div", { className: "bg-purple-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 bg-purple-100 rounded-md p-2", children: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-purple-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-500", children: "Unique Users" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-900", children: stats.uniqueUsers })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-green-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 bg-green-100 rounded-md p-2", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 text-green-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-500", children: "Unique Quizzes" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-900", children: stats.uniqueQuizzes })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-blue-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 bg-blue-100 rounded-md p-2", children: /* @__PURE__ */ jsx(Award, { className: "h-5 w-5 text-blue-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-500", children: "Average Score" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [
            stats.averageScore,
            "%"
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
};
const ProfilePage = () => {
  const { user, signOut: signOut2 } = useAuth();
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalQuizzesTaken: 0,
    averageTime: 0
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchQuizAttempts2 = async () => {
      try {
        setLoading(true);
        setError(null);
        const attemptsQuery = query(
          collection(db, "quizAttempts"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(attemptsQuery);
        const attempts = [];
        let totalScore = 0;
        let bestScore = 0;
        let totalTime = 0;
        const uniqueQuizzes = /* @__PURE__ */ new Set();
        querySnapshot.forEach((doc2) => {
          try {
            const data = doc2.data();
            if (!data.quizId || !data.quizTitle || data.score === void 0 || data.totalQuestions === void 0 || !data.completedAt) {
              console.warn("Skipping invalid quiz attempt data:", data);
              return;
            }
            const completedAt = data.completedAt instanceof Date ? data.completedAt : data.completedAt.toDate ? data.completedAt.toDate() : /* @__PURE__ */ new Date();
            attempts.push({
              id: doc2.id,
              quizId: data.quizId,
              quizTitle: data.quizTitle,
              score: data.score,
              totalQuestions: data.totalQuestions,
              completedAt,
              timeTaken: data.timeTaken || 0
            });
            const scorePercentage = data.score / data.totalQuestions * 100;
            totalScore += scorePercentage;
            bestScore = Math.max(bestScore, scorePercentage);
            totalTime += data.timeTaken || 0;
            uniqueQuizzes.add(data.quizId);
          } catch (docErr) {
            console.error("Error processing quiz attempt document:", docErr);
          }
        });
        attempts.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
        setQuizAttempts(attempts);
        if (attempts.length > 0) {
          setSummary({
            totalAttempts: attempts.length,
            averageScore: Math.round(totalScore / attempts.length),
            bestScore: Math.round(bestScore),
            totalQuizzesTaken: uniqueQuizzes.size,
            averageTime: Math.round(totalTime / attempts.length)
          });
        }
      } catch (err) {
        console.error("Error fetching quiz attempts:", err);
        setError("Failed to load your quiz history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAttempts2();
  }, [user, navigate]);
  const handleSignOut = async () => {
    try {
      await signOut2();
      navigate("/");
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out. Please try again.");
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };
  const handleRetry = () => {
    if (user) {
      fetchQuizAttempts();
    }
  };
  if (!user) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-lg overflow-hidden mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-indigo-600 px-6 py-8 text-white", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full bg-white flex items-center justify-center mr-4", children: user.photoURL ? /* @__PURE__ */ jsx(
          "img",
          {
            src: user.photoURL,
            alt: user.displayName || "User",
            className: "w-20 h-20 rounded-full"
          }
        ) : /* @__PURE__ */ jsx(User, { className: "w-10 h-10 text-indigo-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: user.displayName || "User" }),
          /* @__PURE__ */ jsx("p", { className: "text-indigo-100", children: user.email })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSignOut,
            className: "ml-auto flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-colors",
            children: [
              /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 mr-2" }),
              "Sign out"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Your Quiz Statistics" }),
        user && /* @__PURE__ */ jsx(QuizStats, { userId: user.uid })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Your Quiz History" }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        error && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("p", { children: error }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleRetry,
              className: "flex items-center text-red-700 hover:text-red-900",
              children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-1" }),
                "Retry"
              ]
            }
          )
        ] }),
        loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" }) }) : quizAttempts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
          /* @__PURE__ */ jsx("p", { children: "You haven't completed any quizzes yet." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate("/quizzes"),
              className: "mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700",
              children: "Browse Quizzes"
            }
          )
        ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Quiz" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Score" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Time Taken" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: quizAttempts.map((attempt) => {
            const scorePercentage = Math.round(attempt.score / attempt.totalQuestions * 100);
            let scoreClass = "text-red-600";
            if (scorePercentage >= 70) {
              scoreClass = "text-green-600";
            } else if (scorePercentage >= 40) {
              scoreClass = "text-yellow-600";
            }
            return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: attempt.quizTitle }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-900", children: [
                attempt.score,
                " / ",
                attempt.totalQuestions,
                /* @__PURE__ */ jsxs("span", { className: `ml-2 text-xs font-medium ${scoreClass}`, children: [
                  "(",
                  scorePercentage,
                  "%)"
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900", children: formatTime(attempt.timeTaken) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900", children: formatDate(attempt.completedAt) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => navigate(`/quiz/${attempt.quizId}`),
                  className: "text-indigo-600 hover:text-indigo-900",
                  children: "Retake Quiz"
                }
              ) })
            ] }, attempt.id);
          }) })
        ] }) })
      ] })
    ] })
  ] }) });
};
const ProtectedRoute = ({
  children,
  requireAdmin = true
}) => {
  const { user, loading, isAdmin } = useAuth();
  useNavigate();
  useEffect(() => {
    if (user && !loading && requireAdmin && !isAdmin) {
      const hasShownAdminAlert = localStorage.getItem("hasShownAdminAlert");
      if (!hasShownAdminAlert) {
        alert("You do not have admin privileges. This area is restricted to administrators only.");
        localStorage.setItem("hasShownAdminAlert", "true");
        setTimeout(() => {
          localStorage.removeItem("hasShownAdminAlert");
        }, 36e5);
      }
    }
  }, [user, loading, isAdmin, requireAdmin]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (requireAdmin) {
    if (!user) {
      return /* @__PURE__ */ jsx(Navigate, { to: "/admin/login" });
    }
    if (!isAdmin) {
      return /* @__PURE__ */ jsx(Navigate, { to: "/login", state: { adminAccessDenied: true } });
    }
  } else {
    if (!user) {
      return /* @__PURE__ */ jsx(Navigate, { to: "/login" });
    }
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
};
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate("/admin");
    } catch (error2) {
      if (error2 instanceof Error) {
        setError(error2.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(Shield, { className: "h-8 w-8 text-indigo-600" }) }),
      /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Administrator Login" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "This area is restricted to administrators only" })
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: error }) }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "email-address", className: "sr-only", children: "Email address" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "email-address",
              name: "email",
              type: "email",
              autoComplete: "email",
              required: true,
              className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
              placeholder: "Admin email address",
              value: email,
              onChange: (e) => setEmail(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "sr-only", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              name: "password",
              type: "password",
              autoComplete: "current-password",
              required: true,
              className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
              placeholder: "Admin password",
              value: password,
              onChange: (e) => setPassword(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400",
          children: loading ? "Signing in..." : "Sign in as Administrator"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
        "Not an administrator? ",
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Sign in as user" })
      ] }) })
    ] })
  ] }) });
};
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut: signOut2 } = useAuth();
  const location = useLocation();
  const menuItems = [
    { title: "Dashboard", path: "/admin", icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5" }) },
    { title: "Blog Posts", path: "/admin/posts", icon: /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" }) },
    { title: "Categories", path: "/admin/categories", icon: /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5" }) },
    { title: "Custom Pages", path: "/admin/custom-pages", icon: /* @__PURE__ */ jsx(FileEdit, { className: "w-5 h-5" }) },
    { title: "Banners", path: "/admin/banners", icon: /* @__PURE__ */ jsx(Image, { className: "w-5 h-5" }) },
    { title: "Marquee Items", path: "/admin/marquee-items", icon: /* @__PURE__ */ jsx(Type, { className: "w-5 h-5" }) },
    { title: "Courses", path: "/admin/courses", icon: /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5" }) },
    { title: "Messages", path: "/admin/messages", icon: /* @__PURE__ */ jsx(MessageSquare, { className: "w-5 h-5" }) },
    { title: "Quizzes", path: "/admin/quizzes", icon: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }) },
    { title: "Quiz Attempts", path: "/admin/quiz-attempts", icon: /* @__PURE__ */ jsx(BarChart, { className: "w-5 h-5" }) },
    { title: "Prelims MCQs", path: "/admin/prelims-mcqs", icon: /* @__PURE__ */ jsx(ClipboardCheck, { className: "w-5 h-5" }) },
    { title: "Mains PYQs", path: "/admin/mains-pyqs", icon: /* @__PURE__ */ jsx(FileQuestion, { className: "w-5 h-5" }) }
  ];
  const handleSignOut = async () => {
    try {
      await signOut2();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100 flex", children: [
    isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden",
        onClick: () => setIsSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: `
          fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-200 ease-in-out z-30
        `,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "h-16 flex items-center justify-between px-4 border-b", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-gray-800", children: "Admin Panel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "lg:hidden p-2 rounded-md hover:bg-gray-100",
                onClick: () => setIsSidebarOpen(false),
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("nav", { className: "p-4 space-y-1", children: [
            menuItems.map((item) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: item.path,
                className: `
                flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
                ${location.pathname === item.path ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}
              `,
                children: [
                  item.icon,
                  /* @__PURE__ */ jsx("span", { children: item.title })
                ]
              },
              item.path
            )),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleSignOut,
                className: "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Sign Out" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("header", { className: "h-16 bg-white shadow-sm flex items-center px-4 sticky top-0 z-10", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2",
          onClick: () => setIsSidebarOpen(true),
          children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
        }
      ) }),
      /* @__PURE__ */ jsx("main", { className: "p-6", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
};
const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    totalUsers: 0,
    averageTime: 0
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData, coursesData] = await Promise.all([
          getBlogPosts(),
          getCategories(),
          getCourses()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
        setCourses(coursesData);
      } catch (error2) {
        console.error("Error fetching dashboard data:", error2);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchQuizAttempts2 = async () => {
      try {
        setLoading(true);
        const attemptsQuery = query(
          collection(db, "quizAttempts"),
          orderBy("completedAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(attemptsQuery);
        const attempts = [];
        let totalScore = 0;
        let totalTime = 0;
        const uniqueUsers = /* @__PURE__ */ new Set();
        querySnapshot.forEach((doc2) => {
          const data = doc2.data();
          attempts.push({
            id: doc2.id,
            userId: data.userId,
            userEmail: data.userEmail || "Unknown",
            userDisplayName: data.userDisplayName || "Unknown User",
            quizId: data.quizId,
            quizTitle: data.quizTitle,
            score: data.score,
            totalQuestions: data.totalQuestions,
            timeTaken: data.timeTaken,
            completedAt: data.completedAt.toDate()
          });
          totalScore += data.score / data.totalQuestions * 100;
          totalTime += data.timeTaken;
          uniqueUsers.add(data.userId);
        });
        setRecentAttempts(attempts);
        setStats({
          totalAttempts: attempts.length,
          averageScore: attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0,
          totalUsers: uniqueUsers.size,
          averageTime: attempts.length > 0 ? Math.round(totalTime / attempts.length) : 0
        });
      } catch (err) {
        console.error("Error fetching quiz attempts:", err);
        setError("Failed to load quiz attempts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAttempts2();
  }, []);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };
  const statCards = [
    {
      title: "Total Attempts",
      value: stats.totalAttempts,
      icon: /* @__PURE__ */ jsx(Award, { className: "h-6 w-6" }),
      color: "bg-blue-500"
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: /* @__PURE__ */ jsx(Award, { className: "h-6 w-6" }),
      color: "bg-green-500"
    },
    {
      title: "Unique Users",
      value: stats.totalUsers,
      icon: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6" }),
      color: "bg-purple-500"
    },
    {
      title: "Average Time",
      value: formatTime(stats.averageTime),
      icon: /* @__PURE__ */ jsx(Clock, { className: "h-6 w-6" }),
      color: "bg-orange-500"
    }
  ];
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [
      /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "Error!" }),
      /* @__PURE__ */ jsxs("span", { className: "block sm:inline", children: [
        " ",
        error
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "sm:flex sm:items-center sm:justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Dashboard" }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "ml-5 w-0 flex-1", children: /* @__PURE__ */ jsxs("dl", { children: [
            /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Posts" }),
            /* @__PURE__ */ jsx("dd", { className: "flex items-baseline", children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold text-gray-900", children: posts.length }) })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-5 py-3", children: /* @__PURE__ */ jsx("div", { className: "text-sm", children: /* @__PURE__ */ jsx(Link, { to: "/admin/posts", className: "font-medium text-blue-600 hover:text-blue-500", children: "View all posts" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "ml-5 w-0 flex-1", children: /* @__PURE__ */ jsxs("dl", { children: [
            /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Categories" }),
            /* @__PURE__ */ jsx("dd", { className: "flex items-baseline", children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold text-gray-900", children: categories.length }) })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-5 py-3", children: /* @__PURE__ */ jsx("div", { className: "text-sm", children: /* @__PURE__ */ jsx(Link, { to: "/admin/categories", className: "font-medium text-blue-600 hover:text-blue-500", children: "Manage categories" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-6 w-6 text-gray-400" }) }),
          /* @__PURE__ */ jsx("div", { className: "ml-5 w-0 flex-1", children: /* @__PURE__ */ jsxs("dl", { children: [
            /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Courses" }),
            /* @__PURE__ */ jsx("dd", { className: "flex items-baseline", children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold text-gray-900", children: courses.length }) })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-5 py-3", children: /* @__PURE__ */ jsx("div", { className: "text-sm", children: /* @__PURE__ */ jsx(Link, { to: "/admin/courses", className: "font-medium text-blue-600 hover:text-blue-500", children: "Manage courses" }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Quick Actions" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/admin/posts/new",
              className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full justify-center",
              children: "Create New Post"
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/admin/courses",
              className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 w-full justify-center",
              children: [
                /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 mr-2" }),
                "Create New Course"
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8", children: statCards.map((stat, index) => /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 rounded-md p-3 ${stat.color} text-white`, children: stat.icon }),
      /* @__PURE__ */ jsx("div", { className: "ml-5 w-0 flex-1", children: /* @__PURE__ */ jsxs("dl", { children: [
        /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: stat.title }),
        /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx("div", { className: "text-lg font-medium text-gray-900", children: stat.value }) })
      ] }) })
    ] }) }) }, index)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-md mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 border-b border-gray-200 sm:px-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Recent Quiz Attempts" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "A list of the most recent quiz attempts by users" })
      ] }),
      recentAttempts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-5 sm:p-6 text-center text-gray-500", children: "No quiz attempts recorded yet." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200", children: recentAttempts.map((attempt) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-4 sm:px-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(User, { className: "h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" }) }),
            /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-indigo-600", children: attempt.userDisplayName }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: attempt.userEmail })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "ml-2 flex-shrink-0 flex", children: /* @__PURE__ */ jsxs("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attempt.score / attempt.totalQuestions * 100 >= 70 ? "bg-green-100 text-green-800" : attempt.score / attempt.totalQuestions * 100 >= 40 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`, children: [
            Math.round(attempt.score / attempt.totalQuestions * 100),
            "%"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 sm:flex sm:justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "sm:flex", children: /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-1 font-medium", children: "Quiz:" }),
            " ",
            attempt.quizTitle
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: [
            /* @__PURE__ */ jsx(Clock, { className: "flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Completed ",
              formatDate(attempt.completedAt),
              " • Time: ",
              formatTime(attempt.timeTaken)
            ] })
          ] })
        ] })
      ] }) }, attempt.id)) })
    ] })
  ] });
};
const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showCurrentAffairs, setShowCurrentAffairs] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);
  const fetchPosts = async () => {
    try {
      const data = await getBlogPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    let result = [...posts];
    if (showCurrentAffairs) {
      result = result.filter((post) => post.isCurrentAffair);
      if (filter !== "all") {
        result = result.filter((post) => post.examType === filter);
      }
    } else if (showBlogs) {
      result = result.filter((post) => post.isBlog);
    } else {
      result = result.filter((post) => !post.isCurrentAffair && !post.isBlog);
    }
    setFilteredPosts(result);
  }, [posts, filter, showCurrentAffairs, showBlogs]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      await deleteBlogPost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-full overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "sm:flex sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: showCurrentAffairs ? "Current Affairs" : showBlogs ? "Blog Posts" : "Notes" }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 sm:mt-0", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/admin/posts/new",
          className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          children: [
            "Create New ",
            showCurrentAffairs ? "Current Affair" : showBlogs ? "Blog Post" : "Note"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white p-4 shadow rounded-md", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Content Type" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setShowCurrentAffairs(false);
                setShowBlogs(false);
              },
              className: `px-3 py-1 text-sm rounded-md whitespace-nowrap ${!showCurrentAffairs && !showBlogs ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100 text-gray-800"}`,
              children: "Notes"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setShowCurrentAffairs(false);
                setShowBlogs(true);
              },
              className: `px-3 py-1 text-sm rounded-md whitespace-nowrap ${showBlogs ? "bg-green-100 text-green-800 font-medium" : "bg-gray-100 text-gray-800"}`,
              children: "Blogs"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setShowCurrentAffairs(true);
                setShowBlogs(false);
              },
              className: `px-3 py-1 text-sm rounded-md whitespace-nowrap ${showCurrentAffairs ? "bg-orange-100 text-orange-800 font-medium" : "bg-gray-100 text-gray-800"}`,
              children: "Current Affairs"
            }
          )
        ] })
      ] }),
      showCurrentAffairs && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Exam Type" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setFilter("all"),
              className: `px-3 py-1 text-sm rounded-md whitespace-nowrap ${filter === "all" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100 text-gray-800"}`,
              children: "All"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setFilter("upsc"),
              className: `px-3 py-1 text-sm rounded-md whitespace-nowrap ${filter === "upsc" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100 text-gray-800"}`,
              children: "UPSC"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setFilter("tgpsc"),
              className: `px-3 py-1 text-sm rounded-md whitespace-nowrap ${filter === "tgpsc" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100 text-gray-800"}`,
              children: "TGPSC"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setFilter("appsc"),
              className: `px-3 py-1 text-sm rounded-md whitespace-nowrap ${filter === "appsc" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100 text-gray-800"}`,
              children: "APPSC"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md max-w-full", children: filteredPosts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-6 text-center text-gray-500", children: [
      "No ",
      showCurrentAffairs ? "current affairs" : showBlogs ? "blog posts" : "notes",
      " found",
      showCurrentAffairs && filter !== "all" ? ` for ${filter.toUpperCase()}` : "",
      "."
    ] }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200", children: filteredPosts.map((post) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("div", { className: "px-4 py-4 sm:px-6 max-w-full overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 max-w-full overflow-hidden", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-blue-600 truncate break-all", children: post.title }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-2 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, children: post.published ? "Published" : "Draft" }),
          post.isCurrentAffair && post.examType && /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.examType === "upsc" ? "bg-blue-100 text-blue-800" : post.examType === "tgpsc" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`, children: post.examType.toUpperCase() }),
          post.isBlog && /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800", children: "BLOG" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs whitespace-nowrap", children: post.isCurrentAffair && post.currentAffairDate ? `Date: ${new Date(post.currentAffairDate).toLocaleDateString()}` : `Created: ${new Date(post.createdAt).toLocaleDateString()}` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 break-words line-clamp-2", children: post.excerpt }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 sm:flex-col sm:gap-1 flex-shrink-0", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: `/admin/posts/edit/${post.id}`,
            className: "px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 hover:border-blue-300 transition-colors",
            children: "Edit"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(post.id),
            className: "px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 hover:border-red-300 transition-colors",
            children: "Delete"
          }
        ),
        post.published && /* @__PURE__ */ jsx(
          "a",
          {
            href: post.isBlog ? `/blogs/${post.slug}` : `/notes/${post.slug}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 hover:border-gray-300 transition-colors",
            children: "View"
          }
        )
      ] })
    ] }) }) }, post.id)) }) })
  ] });
};
const COLOR_PALETTE = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#C0C0C0",
  "#808080",
  "#FF9999",
  "#99FF99",
  "#9999FF",
  "#FFFF99",
  "#FF99FF",
  "#99FFFF"
];
class CustomLexicalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Advanced Lexical Editor Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxs("div", { className: "min-h-[200px] p-4 border border-red-300 rounded bg-red-50 text-red-700", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Editor Error" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: "Something went wrong with the editor. Please refresh the page." })
      ] });
    }
    return this.props.children;
  }
}
function EnhancedFirebaseInitializerPlugin({
  content,
  editorState,
  initialContentRef
}) {
  const [editor] = useLexicalComposerContext();
  const [hasInitialized, setHasInitialized] = useState(false);
  useRef(content);
  useRef(editorState);
  useEffect(() => {
    if (hasInitialized) {
      console.log("⚠️ Skipping re-initialization to protect keyboard input - already initialized");
      return;
    }
    const hasEditorState = editorState && editorState.trim();
    const hasContent = content && content.trim();
    const isFirstMount = !hasInitialized;
    const shouldInitialize = isFirstMount && (hasEditorState || hasContent);
    if (!shouldInitialize) {
      if (isFirstMount) {
        setHasInitialized(true);
        console.log("✅ Empty editor initialized - ready for typing");
      }
      return;
    }
    console.log("🔄 Ultra-Conservative Initializer (ONE-TIME ONLY):", {
      isFirstMount,
      hasEditorState,
      hasContent,
      contentPreview: (content || "").substring(0, 50) + "...",
      action: hasEditorState ? "Loading JSON state" : hasContent ? "Loading HTML content" : "Initial empty setup"
    });
    const initializeContentSafely = () => {
      try {
        if (hasEditorState) {
          console.log("✅ Loading from JSON editor state (preferred method)");
          try {
            const parsedState = JSON.parse(editorState);
            const newEditorState = editor.parseEditorState(parsedState);
            editor.setEditorState(newEditorState);
            setHasInitialized(true);
            console.log("✅ JSON state loaded successfully - keyboard protected");
            return;
          } catch (parseError) {
            console.warn("⚠️ JSON state parsing failed, falling back to HTML:", parseError);
          }
        }
        if (hasContent) {
          console.log("⚠️ Loading from HTML content (fallback method)");
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            const isHtmlContent = content.startsWith("<") || content.includes("<") && content.includes(">");
            if (isHtmlContent) {
              try {
                const parser = new DOMParser();
                const dom = parser.parseFromString(content, "text/html");
                const nodes = $generateNodesFromDOM(editor, dom);
                if (nodes.length > 0) {
                  root.append(...nodes);
                } else {
                  const paragraph = $createParagraphNode();
                  paragraph.append($createTextNode(content.replace(/<[^>]*>/g, "")));
                  root.append(paragraph);
                }
              } catch (htmlError) {
                console.warn("HTML parsing failed, using plain text:", htmlError);
                const paragraph = $createParagraphNode();
                paragraph.append($createTextNode(content));
                root.append(paragraph);
              }
            } else {
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(content));
              root.append(paragraph);
            }
          });
          setHasInitialized(true);
          console.log("✅ HTML content loaded successfully - keyboard protected");
          return;
        }
        if (isFirstMount) {
          editor.update(() => {
            const root = $getRoot();
            if (root.getChildren().length === 0) {
              const paragraph = $createParagraphNode();
              root.append(paragraph);
            }
          });
          setHasInitialized(true);
          console.log("✅ Empty editor initialized - ready for typing");
        }
      } catch (error) {
        console.error("❌ Content initialization error:", error);
        if (!hasInitialized) {
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            const paragraph = $createParagraphNode();
            root.append(paragraph);
          });
          setHasInitialized(true);
          console.log("🚨 Emergency fallback initialization completed");
        }
      }
    };
    const timeoutId = setTimeout(() => {
      initializeContentSafely();
    }, 0);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [editor, content, editorState, hasInitialized]);
  return null;
}
function ColorPicker({
  color,
  onChange,
  title
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const pickerRef = useRef(null);
  useEffect(() => {
    setHexInput(color);
  }, [color]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const handleColorSelect = (selectedColor) => {
    setHexInput(selectedColor);
    onChange(selectedColor);
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: pickerRef, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(!isOpen),
        className: "w-8 h-8 border border-gray-300 rounded-md cursor-pointer flex items-center justify-center hover:border-gray-400 transition-all duration-200 shadow-sm",
        style: { backgroundColor: color },
        title,
        children: [
          title.includes("Text") && /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", style: {
            color: color === "#000000" ? "#ffffff" : "#000000",
            filter: color === "#000000" ? "none" : "drop-shadow(1px 1px 1px rgba(255,255,255,0.8))"
          }, children: /* @__PURE__ */ jsx("path", { d: "M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" }) }),
          title.includes("Background") && /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-600", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.91-1.93 3.12-3.12c.39-.39.39-1.02 0-1.41zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z" }) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 mt-1 p-3 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px]", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1 mb-3", children: COLOR_PALETTE.map((paletteColor) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleColorSelect(paletteColor),
          className: "w-6 h-6 border border-gray-200 rounded hover:scale-110",
          style: { backgroundColor: paletteColor },
          title: paletteColor
        },
        paletteColor
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: hexInput,
            onChange: (e) => setHexInput(e.target.value),
            placeholder: "#000000",
            className: "flex-1 px-2 py-1 text-sm border border-gray-300 rounded",
            onKeyPress: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
                  onChange(hexInput);
                  setIsOpen(false);
                }
              }
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
                onChange(hexInput);
                setIsOpen(false);
              }
            },
            className: "px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600",
            children: "Apply"
          }
        )
      ] })
    ] })
  ] });
}
function ComprehensiveToolbarPlugin({
  onSave,
  showSaveButton = false
}) {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontColor, setFontColor] = useState("#000000");
  const [blockType, setBlockType] = useState("paragraph");
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const updateToolbar = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
        setIsCode(selection.hasFormat("code"));
        setIsSubscript(selection.hasFormat("subscript"));
        setIsSuperscript(selection.hasFormat("superscript"));
        const fontSizeValue = $getSelectionStyleValueForProperty(selection, "font-size", "16px") || "16px";
        setFontSize(fontSizeValue);
        const fontFamilyValue = $getSelectionStyleValueForProperty(selection, "font-family", "Arial") || "Arial";
        setFontFamily(fontFamilyValue);
        const colorValue = $getSelectionStyleValueForProperty(selection, "color", "#000000") || "#000000";
        setFontColor(colorValue);
      }
    };
    const unregisterMergeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        try {
          updateToolbar();
        } catch (error) {
          console.error("Error updating toolbar:", error);
        }
      });
    });
    const unregisterCommand1 = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (canUndo2) => {
        setCanUndo(canUndo2);
        return false;
      },
      1
    );
    const unregisterCommand2 = editor.registerCommand(
      CAN_REDO_COMMAND,
      (canRedo2) => {
        setCanRedo(canRedo2);
        return false;
      },
      1
    );
    return () => {
      unregisterMergeListener();
      unregisterCommand1();
      unregisterCommand2();
    };
  }, [editor]);
  const formatText = (format2) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format2);
  };
  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const formats = ["bold", "italic", "underline", "strikethrough", "code", "subscript", "superscript"];
        formats.forEach((format2) => {
          if (selection.hasFormat(format2)) {
            selection.toggleFormat(format2);
          }
        });
        $patchStyleText(selection, {
          "font-size": null,
          "font-family": null,
          "color": null,
          "background-color": null
        });
      }
    });
  };
  const handleUndo = () => editor.dispatchCommand(UNDO_COMMAND, void 0);
  const handleRedo = () => editor.dispatchCommand(REDO_COMMAND, void 0);
  const handleFontSizeChange = (newSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-size": newSize });
      }
    });
    setFontSize(newSize);
  };
  const handleFontFamilyChange = (newFamily) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-family": newFamily });
      }
    });
    setFontFamily(newFamily);
  };
  const handleColorChange = (color) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "color": color });
      }
    });
    setFontColor(color);
  };
  const transformText = (transformation) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const text = selection.getTextContent();
        let transformedText = "";
        switch (transformation) {
          case "lowercase":
            transformedText = text.toLowerCase();
            break;
          case "uppercase":
            transformedText = text.toUpperCase();
            break;
          case "capitalize":
            transformedText = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            break;
        }
        selection.insertText(transformedText);
      }
    });
  };
  const formatBlock = (blockType2) => {
    if (blockType2 === "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    } else if (blockType2.startsWith("h")) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(blockType2));
        }
      });
    } else if (blockType2 === "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else if (blockType2 === "code-block") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
    setBlockType(blockType2);
  };
  const insertList = (listType) => {
    if (listType === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, void 0);
    } else if (listType === "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, void 0);
    }
  };
  const handleAlignment = (alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };
  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      editor.getEditorState().read(() => {
        try {
          const htmlString = $generateHtmlFromNodes(editor);
          const editorState = JSON.stringify(editor.getEditorState().toJSON());
          onSave(htmlString, editorState);
          console.log("✅ Manual save completed");
        } catch (error) {
          console.error("❌ Error during manual save:", error);
        }
      });
    } finally {
      setIsSaving(false);
    }
  }, [editor, onSave]);
  return /* @__PURE__ */ jsxs("div", { className: "toolbar flex flex-wrap items-center gap-2 p-4 border-b border-gray-200 bg-gray-50 shadow-sm", children: [
    showSaveButton && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleSave,
          disabled: isSaving,
          className: "px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all duration-200",
          title: "Save Content",
          children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
            ] }),
            "Saving..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" }) }),
            "Save"
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300 mx-1" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleUndo,
          disabled: !canUndo,
          className: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200",
          title: "Undo (Ctrl+Z)",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleRedo,
          disabled: !canRedo,
          className: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200",
          title: "Redo (Ctrl+Y)",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300 mx-1" }),
    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs(
      "select",
      {
        value: blockType,
        onChange: (e) => formatBlock(e.target.value),
        className: "px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm",
        children: [
          /* @__PURE__ */ jsx("option", { value: "paragraph", children: "Normal" }),
          /* @__PURE__ */ jsx("option", { value: "h1", children: "Heading 1" }),
          /* @__PURE__ */ jsx("option", { value: "h2", children: "Heading 2" }),
          /* @__PURE__ */ jsx("option", { value: "h3", children: "Heading 3" }),
          /* @__PURE__ */ jsx("option", { value: "quote", children: "Quote" }),
          /* @__PURE__ */ jsx("option", { value: "code-block", children: "Code Block" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs(
      "select",
      {
        value: fontFamily,
        onChange: (e) => handleFontFamilyChange(e.target.value),
        className: "px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm",
        children: [
          /* @__PURE__ */ jsx("option", { value: "Arial", children: "Arial" }),
          /* @__PURE__ */ jsx("option", { value: "Georgia", children: "Georgia" }),
          /* @__PURE__ */ jsx("option", { value: "Times New Roman", children: "Times New Roman" }),
          /* @__PURE__ */ jsx("option", { value: "Helvetica", children: "Helvetica" }),
          /* @__PURE__ */ jsx("option", { value: "Courier New", children: "Courier New" }),
          /* @__PURE__ */ jsx("option", { value: "Verdana", children: "Verdana" }),
          /* @__PURE__ */ jsx("option", { value: "Comic Sans MS", children: "Comic Sans MS" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            const currentSize = parseInt(fontSize);
            if (currentSize > 8) {
              handleFontSizeChange(`${currentSize - 1}px`);
            }
          },
          className: "p-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center transition-all duration-200 shadow-sm",
          title: "Decrease Font Size",
          children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: fontSize.replace("px", ""),
          onChange: (e) => handleFontSizeChange(`${e.target.value}px`),
          className: "w-12 px-2 py-2 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            const currentSize = parseInt(fontSize);
            if (currentSize < 72) {
              handleFontSizeChange(`${currentSize + 1}px`);
            }
          },
          className: "p-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center transition-all duration-200 shadow-sm",
          title: "Increase Font Size",
          children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300 mx-1" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => formatText("bold"),
          className: `p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${isBold ? "bg-blue-100 border-blue-300 text-blue-700" : "border-gray-300 text-gray-600 hover:text-gray-900"}`,
          title: "Bold (Ctrl+B)",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M6 4v2h1.5v10H6v2h6c2.2 0 4-1.8 4-4v-1c0-1.5-.8-2.8-2-3.4.6-.6 1-1.4 1-2.3V7c0-1.7-1.3-3-3-3H6zm3 2h3c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1H9V6zm0 5h3.5c.8 0 1.5.7 1.5 1.5v1c0 .8-.7 1.5-1.5 1.5H9v-4z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => formatText("italic"),
          className: `p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${isItalic ? "bg-blue-100 border-blue-300 text-blue-700" : "border-gray-300 text-gray-600 hover:text-gray-900"}`,
          title: "Italic (Ctrl+I)",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => formatText("underline"),
          className: `p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${isUnderline ? "bg-blue-100 border-blue-300 text-blue-700" : "border-gray-300 text-gray-600 hover:text-gray-900"}`,
          title: "Underline (Ctrl+U)",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => formatText("strikethrough"),
          className: `p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${isStrikethrough ? "bg-blue-100 border-blue-300 text-blue-700" : "border-gray-300 text-gray-600 hover:text-gray-900"}`,
          title: "Strikethrough",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.26zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13-.35-.09-.65-.22-.89-.39-.25-.17-.44-.37-.59-.62-.15-.24-.22-.5-.22-.78H12c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28.66-.19 1.23-.45 1.7-.78.47-.33.84-.73 1.1-1.2.26-.47.38-1.01.38-1.61 0-.5-.13-.98-.38-1.44-.25-.45-.59-.85-1.01-1.18-.42-.33-.93-.63-1.52-.89-.59-.25-1.25-.47-1.97-.65H21z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => formatText("code"),
          className: `p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${isCode ? "bg-blue-100 border-blue-300 text-blue-700" : "border-gray-300 text-gray-600 hover:text-gray-900"}`,
          title: "Inline Code",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => formatText("subscript"),
          className: `p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm flex items-center justify-center ${isSubscript ? "bg-blue-100 border-blue-300 text-blue-700" : "border-gray-300 text-gray-600 hover:text-gray-900"}`,
          title: "Subscript",
          children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "X₂" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => formatText("superscript"),
          className: `p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm flex items-center justify-center ${isSuperscript ? "bg-blue-100 border-blue-300 text-blue-700" : "border-gray-300 text-gray-600 hover:text-gray-900"}`,
          title: "Superscript",
          children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "X²" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: clearFormatting,
        className: "p-2 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-200 shadow-sm",
        title: "Clear Formatting",
        children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300 mx-1" }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
      ColorPicker,
      {
        color: fontColor,
        onChange: handleColorChange,
        title: "Text Color"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300" }),
    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs(
      "select",
      {
        className: "px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm",
        onChange: (e) => {
          const value = e.target.value;
          if (value === "lowercase" || value === "uppercase" || value === "capitalize") {
            transformText(value);
            e.target.value = "transform";
          }
        },
        defaultValue: "transform",
        children: [
          /* @__PURE__ */ jsx("option", { value: "transform", children: "Transform" }),
          /* @__PURE__ */ jsx("option", { value: "lowercase", children: "lowercase" }),
          /* @__PURE__ */ jsx("option", { value: "uppercase", children: "UPPERCASE" }),
          /* @__PURE__ */ jsx("option", { value: "capitalize", children: "Capitalize" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300 mx-1" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => insertList("bullet"),
          className: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm",
          title: "Bullet List",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM8 19h12v-2H8v2zm0-6h12v-2H8v2zm0-8v2h12V5H8z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => insertList("number"),
          className: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm",
          title: "Numbered List",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h12V5H7zm0 14h12v-2H7v2zm0-6h12v-2H7v2z" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300 mx-1" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleAlignment("left"),
          className: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm",
          title: "Align Left",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h8m-8 6h16" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleAlignment("center"),
          className: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm",
          title: "Align Center",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M8 12h8m-8 6h16" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleAlignment("right"),
          className: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm",
          title: "Align Right",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M12 12h8M4 18h16" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleAlignment("justify"),
          className: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm",
          title: "Justify",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300" })
  ] });
}
function KeyboardShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "1":
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode("h1"));
                }
              });
            }
            break;
          case "2":
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode("h2"));
                }
              });
            }
            break;
          case "3":
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode("h3"));
                }
              });
            }
            break;
          case "e":
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createCodeNode());
                }
              });
            }
            break;
          case "q":
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createQuoteNode());
                }
              });
            }
            break;
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);
  return null;
}
function FirebasePlugin({
  documentId,
  collection: collection2,
  content,
  onChange
}) {
  const saveToFirebase = useCallback(async (content2) => {
    if (!documentId || !collection2) return;
    try {
      const docRef = doc(db, collection2, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          content: content2,
          updatedAt: /* @__PURE__ */ new Date()
        });
        console.log("Content saved to Firebase");
      } else {
        console.log("Document does not exist, skipping save");
      }
    } catch (error) {
      console.error("Error saving to Firebase:", error);
    }
  }, [documentId, collection2]);
  const loadFromFirebase = useCallback(async () => {
    if (!documentId || !collection2) return;
    try {
      const docRef = doc(db, collection2, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.content && data.content !== content) {
          onChange(data.content);
        }
      }
    } catch (error) {
      console.error("Error loading from Firebase:", error);
    }
  }, [documentId, collection2, content, onChange]);
  useEffect(() => {
    loadFromFirebase();
  }, [loadFromFirebase]);
  useEffect(() => {
    window.saveEditorContent = () => saveToFirebase(content);
  }, [saveToFirebase, content]);
  return null;
}
function AutoSavePlugin({
  content,
  onSave,
  interval = 5e3
}) {
  const timeoutRef = useRef();
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onSave(content);
    }, interval);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, onSave, interval]);
  return null;
}
function EnhancedOnChangePlugin({
  onChange,
  onStateChange
}) {
  const [editor] = useLexicalComposerContext();
  const timeoutRef = useRef(null);
  const handleChange = useCallback((editorState) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      try {
        editorState.read(() => {
          try {
            const htmlString = $generateHtmlFromNodes(editor);
            onChange(htmlString);
            if (onStateChange) {
              const stateJson = JSON.stringify(editorState.toJSON());
              onStateChange(stateJson);
              console.log("🔄 Content updated: HTML + JSON state saved");
            } else {
              console.log("🔄 Content updated: HTML only saved");
            }
          } catch (error) {
            console.error("❌ Error generating content:", error);
          }
        });
      } catch (error) {
        console.error("❌ Error in onChange:", error);
      }
    }, 50);
  }, [editor, onChange, onStateChange]);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ jsx(OnChangePlugin, { onChange: handleChange });
}
const AdvancedLexicalEditor = ({
  content,
  editorState,
  onChange,
  onStateChange,
  onSave,
  placeholder = "Start writing...",
  documentId,
  collection: collection2,
  autoSave = false,
  // Changed to false by default
  autoSaveInterval = 5e3,
  showSaveButton = false
}) => {
  const initialContentRef = useRef(content);
  const initialConfig = {
    namespace: "AdvancedEditor",
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
        code: "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono",
        subscript: "align-sub text-xs",
        superscript: "align-super text-xs"
      },
      heading: {
        h1: "text-4xl font-bold mb-4 mt-6",
        h2: "text-3xl font-bold mb-3 mt-5",
        h3: "text-2xl font-bold mb-2 mt-4"
      },
      list: {
        nested: {
          listitem: "list-none"
        },
        ol: "list-decimal list-inside ml-4",
        ul: "list-disc list-inside ml-4",
        listitem: "mb-1"
      },
      quote: "border-l-4 border-blue-300 pl-4 italic text-gray-700 my-4 bg-blue-50 py-2",
      link: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
      code: "bg-gray-900 text-green-400 p-4 my-4 rounded font-mono text-sm overflow-x-auto block",
      table: "border-collapse border border-gray-300 my-4",
      tableCell: "border border-gray-300 px-2 py-1",
      tableCellHeader: "border border-gray-300 px-2 py-1 bg-gray-100 font-bold"
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode
    ],
    onError: (error) => {
      console.error("Advanced Lexical error:", error);
    }
  };
  const [currentEditorState, setCurrentEditorState] = useState("");
  const handleManualSave = useCallback(async (content2, state) => {
    if (documentId && collection2) {
      try {
        const docRef = doc(db, collection2, documentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const updateData = {
            content: content2,
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (state) {
            updateData.editorState = state;
          }
          await updateDoc(docRef, updateData);
          console.log("✅ Manual save to Firebase completed:", {
            contentLength: content2.length,
            hasEditorState: !!state
          });
          return true;
        } else {
          console.log("⚠️ Document does not exist, skipping manual save");
          return false;
        }
      } catch (error) {
        console.error("❌ Manual save error:", error);
        throw error;
      }
    }
    return false;
  }, [documentId, collection2]);
  const handleAutoSave = useCallback((content2, state) => {
    if (documentId && collection2) {
      const saveToFirebase = async () => {
        try {
          const docRef = doc(db, collection2, documentId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const updateData = {
              content: content2,
              updatedAt: /* @__PURE__ */ new Date()
            };
            if (state) {
              updateData.editorState = state;
            }
            await updateDoc(docRef, updateData);
            console.log("✅ Auto-saved to Firebase:", {
              contentLength: content2.length,
              hasEditorState: !!state
            });
          } else {
            console.log("⚠️ Document does not exist, skipping auto-save");
          }
        } catch (error) {
          console.error("❌ Auto-save error:", error);
        }
      };
      saveToFirebase();
    }
  }, [documentId, collection2]);
  const handleStateChange = useCallback((state) => {
    setCurrentEditorState(state);
    if (onStateChange) {
      onStateChange(state);
    }
  }, [onStateChange]);
  const saveFunction = onSave || (documentId && collection2 ? handleManualSave : void 0);
  return /* @__PURE__ */ jsx("div", { className: "advanced-lexical-editor border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm", children: /* @__PURE__ */ jsxs(LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ jsx(
      EnhancedFirebaseInitializerPlugin,
      {
        content,
        editorState,
        initialContentRef
      }
    ),
    /* @__PURE__ */ jsx(
      ComprehensiveToolbarPlugin,
      {
        onSave: saveFunction,
        showSaveButton: showSaveButton || !!documentId && !!collection2 && !autoSave
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        RichTextPlugin,
        {
          contentEditable: /* @__PURE__ */ jsx(
            ContentEditable,
            {
              className: "min-h-[400px] p-6 outline-none text-base leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
              style: { caretColor: "#1f2937" },
              spellCheck: false
            }
          ),
          placeholder: /* @__PURE__ */ jsx("div", { className: "absolute top-6 left-6 text-gray-400 pointer-events-none select-none text-base", children: placeholder }),
          ErrorBoundary: LexicalErrorBoundary
        }
      ),
      /* @__PURE__ */ jsx(HistoryPlugin, {}),
      /* @__PURE__ */ jsx(LinkPlugin, {}),
      /* @__PURE__ */ jsx(ListPlugin, {}),
      /* @__PURE__ */ jsx(TablePlugin, { hasCellMerge: false, hasCellBackgroundColor: false }),
      /* @__PURE__ */ jsx(TabIndentationPlugin, {}),
      /* @__PURE__ */ jsx(MarkdownShortcutPlugin, { transformers: TRANSFORMERS }),
      /* @__PURE__ */ jsx(KeyboardShortcutsPlugin, {}),
      /* @__PURE__ */ jsx(
        FirebasePlugin,
        {
          documentId,
          collection: collection2,
          content,
          onChange
        }
      ),
      autoSave && /* @__PURE__ */ jsx(
        AutoSavePlugin,
        {
          content,
          onSave: (content2) => handleAutoSave(content2, currentEditorState),
          interval: autoSaveInterval
        }
      ),
      /* @__PURE__ */ jsx(
        EnhancedOnChangePlugin,
        {
          onChange,
          onStateChange: handleStateChange
        }
      )
    ] })
  ] }) });
};
const storage = getStorage(app);
const auth = getAuth(app);
const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: "File size exceeds 10MB limit" };
  }
  if (file.type && file.type.startsWith("image/")) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "Invalid image type. Allowed: JPEG, PNG, GIF, WebP" };
    }
  }
  return { isValid: true };
};
const uploadFile = async (file, path) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to upload files");
    }
    console.log("Upload attempt:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      path,
      userId: currentUser.uid
    });
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    const storageRef = ref(storage, path);
    console.log("Storage reference created:", storageRef.fullPath);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        "uploaded-by": currentUser.uid,
        "upload-timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    console.log("Starting upload...");
    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log("Upload completed:", snapshot.metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL obtained:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Detailed upload error:", {
      error,
      errorCode: error.code,
      errorMessage: error.message,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      path,
      userAuthenticated: !!auth.currentUser
    });
    if (error.code === "storage/unauthorized") {
      throw new Error("Upload failed: Insufficient permissions. Please check if you are logged in.");
    } else if (error.code === "storage/quota-exceeded") {
      throw new Error("Upload failed: Storage quota exceeded.");
    } else if (error.code === "storage/invalid-checksum") {
      throw new Error("Upload failed: File corrupted during upload. Please try again.");
    } else if (error.code === "storage/canceled") {
      throw new Error("Upload canceled.");
    } else if (error.code === "storage/unknown") {
      throw new Error("Upload failed: Server error (412). This might be due to storage rules or authentication. Please try again or contact support.");
    } else {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
};
const uploadImage = async (file) => {
  const timestamp = (/* @__PURE__ */ new Date()).getTime();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${timestamp}_${sanitizedFileName}`;
  return uploadFile(file, `images/${fileName}`);
};
const FeaturedImageUpload = ({
  initialImage,
  onImageUploaded
}) => {
  const { user, isAdmin } = useAuth();
  const [image, setImage] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const displayImageUrl = image ? getProxiedImageUrl(image) : void 0;
  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploading(true);
      setError(null);
      console.log("Upload Debug Info:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userAuthenticated: !!user,
        isAdmin,
        userUID: user == null ? void 0 : user.uid,
        userEmail: user == null ? void 0 : user.email
      });
      if (!user) {
        throw new Error("You must be logged in to upload files");
      }
      if (!isAdmin) {
        throw new Error("You must have admin privileges to upload files");
      }
      const imageUrl = await uploadImage(file);
      setImage(imageUrl);
      onImageUploaded(imageUrl);
      console.log("Image upload successful:", imageUrl);
    } catch (error2) {
      console.error("Error uploading image:", error2);
      const errorMessage = error2.message || "Failed to upload image. Please try again.";
      setError(errorMessage);
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleImageUpload(files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, GIF, etc.)");
      return;
    }
    handleImageUpload(file);
  };
  const handleRemoveImage = () => {
    setImage(void 0);
    onImageUploaded(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700", children: [
      "Featured Image",
      user && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs text-green-600", children: [
        "✓ Authenticated ",
        isAdmin ? "(Admin)" : "(User)"
      ] }),
      !user && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-red-600", children: "⚠ Not authenticated" })
    ] }),
    image ? /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg overflow-hidden border border-gray-200 bg-white", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: displayImageUrl || image,
          alt: "Featured",
          className: "w-full h-64 object-contain"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              var _a2;
              return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
            },
            className: "bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            title: "Change image",
            children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleRemoveImage,
            className: "bg-white text-red-600 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
            title: "Remove image",
            children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          className: "hidden",
          accept: "image/*",
          onChange: handleFileInputChange,
          disabled: isUploading
        }
      )
    ] }) : /* @__PURE__ */ jsx(
      "div",
      {
        className: `flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 border-dashed"} rounded-md transition-colors duration-200`,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        children: /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-center", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: `mx-auto h-12 w-12 ${isDragging ? "text-blue-500" : "text-gray-400"}`,
              stroke: "currentColor",
              fill: "none",
              viewBox: "0 0 48 48",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex text-sm text-gray-600 justify-center", children: [
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: "featured-image-upload",
                className: "relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1",
                children: [
                  /* @__PURE__ */ jsx("span", { children: "Upload an image" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: "featured-image-upload",
                      name: "featured-image-upload",
                      type: "file",
                      className: "sr-only",
                      accept: "image/*",
                      onChange: handleFileInputChange,
                      disabled: isUploading,
                      ref: fileInputRef
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "pl-1 flex items-center", children: "or drag and drop" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "PNG, JPG, GIF up to 10MB" })
        ] })
      }
    ),
    isUploading && /* @__PURE__ */ jsx("div", { className: "relative bg-white bg-opacity-75 rounded-md p-4 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5 text-blue-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: "Uploading image..." })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-red-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-red-800", children: "Upload Error" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-red-700", children: /* @__PURE__ */ jsx("p", { children: error }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setError(null),
            className: "text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500",
            children: "Dismiss"
          }
        ) })
      ] })
    ] }) })
  ] });
};
const BlogPostEditor = () => {
  var _a2;
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    metaDescription: "",
    categories: [],
    tags: [],
    author: "",
    published: false,
    isCurrentAffair: false,
    isBlog: false,
    currentAffairDate: Date.now(),
    examType: "upsc"
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        if (id) {
          const post = await getBlogPost(id);
          if (post) {
            setFormData({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt,
              metaDescription: post.metaDescription || "",
              featuredImage: post.featuredImage,
              categories: post.categories,
              tags: post.tags || [],
              author: post.author,
              published: post.published,
              isCurrentAffair: post.isCurrentAffair || false,
              isBlog: post.isBlog || false,
              currentAffairDate: post.currentAffairDate || Date.now(),
              examType: post.examType || "upsc"
            });
          }
        } else {
          setFormData((prev) => ({
            ...prev,
            author: (user == null ? void 0 : user.email) || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);
  const validateForm = () => {
    if (!formData.title.trim()) {
      return { isValid: false, error: "Title is required" };
    }
    if (!formData.content.trim()) {
      return { isValid: false, error: "Content is required" };
    }
    if (!formData.excerpt.trim()) {
      return { isValid: false, error: "Excerpt is required" };
    }
    if (formData.isCurrentAffair && !formData.currentAffairDate) {
      return { isValid: false, error: "Current affair date is required" };
    }
    if (formData.isCurrentAffair && !formData.examType) {
      return { isValid: false, error: "Exam type is required for current affairs" };
    }
    if (!formData.isCurrentAffair && !formData.isBlog && formData.categories.length === 0) {
      return { isValid: false, error: "At least one category is required for regular posts" };
    }
    return { isValid: true };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateForm();
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    setSaving(true);
    console.log("Submitting form data:", formData);
    console.log("isCurrentAffair:", formData.isCurrentAffair);
    console.log("isBlog:", formData.isBlog);
    console.log("examType:", formData.examType);
    console.log("currentAffairDate:", formData.currentAffairDate);
    console.log("currentAffairDate as ISO string:", formData.currentAffairDate ? new Date(formData.currentAffairDate).toISOString() : "No date set");
    const submissionData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      metaDescription: formData.metaDescription,
      categories: formData.categories,
      tags: formData.tags,
      author: formData.author,
      published: formData.published
    };
    if (formData.featuredImage) {
      submissionData.featuredImage = formData.featuredImage;
    }
    if (formData.isCurrentAffair) {
      submissionData.isCurrentAffair = true;
      if (formData.currentAffairDate) {
        submissionData.currentAffairDate = typeof formData.currentAffairDate === "string" ? new Date(formData.currentAffairDate).getTime() : formData.currentAffairDate;
      } else {
        submissionData.currentAffairDate = Date.now();
      }
      submissionData.examType = formData.examType || "upsc";
      console.log("Current affair date timestamp:", submissionData.currentAffairDate);
      console.log("Exam type:", submissionData.examType);
    } else {
      submissionData.isCurrentAffair = false;
    }
    if (formData.isBlog) {
      submissionData.isBlog = true;
    } else {
      submissionData.isBlog = false;
    }
    console.log("Final submission data:", submissionData);
    try {
      if (id) {
        console.log("Updating existing post with ID:", id);
        await updateBlogPost(id, submissionData);
        console.log("Post updated successfully");
      } else {
        console.log("Creating new post");
        const newId = await createBlogPost(submissionData);
        console.log("New post created with ID:", newId);
      }
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      alert(`Failed to save post: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checkbox = e.target;
      setFormData((prev) => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };
  const handleFeaturedImageChange = (imageUrl) => {
    if (imageUrl === null) {
      setFormData((prev) => {
        const newData = { ...prev };
        delete newData.featuredImage;
        return newData;
      });
    } else if (imageUrl && imageUrl.trim() !== "") {
      setFormData((prev) => ({ ...prev, featuredImage: imageUrl }));
    }
  };
  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setFormData((prev) => ({ ...prev, categories: selectedOptions }));
  };
  const handleDateChange = (e) => {
    const date = new Date(e.target.value).getTime();
    setFormData((prev) => ({ ...prev, currentAffairDate: date }));
  };
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "sm:flex sm:items-center sm:justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: id ? "Edit Post" : "Create New Post" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "title",
              id: "title",
              required: true,
              value: formData.title,
              onChange: handleChange,
              className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          FeaturedImageUpload,
          {
            initialImage: formData.featuredImage,
            onImageUploaded: handleFeaturedImageChange
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "content", className: "block text-sm font-medium text-gray-700 mb-1", children: "Content" }),
          /* @__PURE__ */ jsx("div", { className: "min-h-[200px]", children: /* @__PURE__ */ jsx(
            AdvancedLexicalEditor,
            {
              content: formData.content,
              onChange: handleContentChange,
              placeholder: "Write your post content here...",
              documentId: id,
              collection: "blogPosts",
              autoSave: false,
              showSaveButton: !!id
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "excerpt", className: "block text-sm font-medium text-gray-700", children: "Excerpt" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "excerpt",
              name: "excerpt",
              rows: 3,
              required: true,
              value: formData.excerpt,
              onChange: handleChange,
              className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "metaDescription", className: "block text-sm font-medium text-gray-700", children: "Meta Description (for SEO)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "metaDescription",
              name: "metaDescription",
              rows: 2,
              value: formData.metaDescription || "",
              onChange: handleChange,
              className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              placeholder: "Brief description for search engines (150-160 characters recommended)",
              maxLength: 160
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-gray-500", children: [
            formData.metaDescription ? formData.metaDescription.length : 0,
            "/160 characters"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                name: "isCurrentAffair",
                id: "isCurrentAffair",
                checked: formData.isCurrentAffair,
                onChange: handleChange,
                className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "isCurrentAffair", className: "block text-sm font-medium text-gray-700", children: "This is a Current Affair" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                name: "isBlog",
                id: "isBlog",
                checked: formData.isBlog,
                onChange: handleChange,
                className: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "isBlog", className: "block text-sm font-medium text-gray-700", children: "This is a Blog Post" })
          ] }),
          formData.isCurrentAffair && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "currentAffairDate", className: "block text-sm font-medium text-gray-700", children: "Current Affair Date" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  name: "currentAffairDate",
                  id: "currentAffairDate",
                  required: formData.isCurrentAffair,
                  value: formData.currentAffairDate ? new Date(formData.currentAffairDate).toISOString().substring(0, 10) : "",
                  onChange: handleDateChange,
                  className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "examType", className: "block text-sm font-medium text-gray-700", children: "Exam Type" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  name: "examType",
                  id: "examType",
                  required: formData.isCurrentAffair,
                  value: formData.examType || "upsc",
                  onChange: handleChange,
                  className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "upsc", children: "UPSC" }),
                    /* @__PURE__ */ jsx("option", { value: "tgpsc", children: "TGPSC" }),
                    /* @__PURE__ */ jsx("option", { value: "appsc", children: "APPSC" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: formData.isCurrentAffair || formData.isBlog ? "hidden" : "", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "categories", className: "block text-sm font-medium text-gray-700", children: "Categories" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              id: "categories",
              name: "categories",
              multiple: true,
              value: formData.categories,
              onChange: handleCategoryChange,
              className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              children: categories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Hold Ctrl (or Cmd) to select multiple categories" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "tags", className: "block text-sm font-medium text-gray-700", children: "Tags (comma-separated)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "tags",
              id: "tags",
              value: (_a2 = formData.tags) == null ? void 0 : _a2.join(", "),
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
              })),
              className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              name: "published",
              id: "published",
              checked: formData.published,
              onChange: handleChange,
              className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "published", className: "ml-2 block text-sm text-gray-900", children: "Publish post" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate("/admin/posts"),
            className: "inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: saving,
            className: "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
            children: saving ? "Saving..." : "Save"
          }
        )
      ] })
    ] })
  ] });
};
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const id = await createCategory(newCategoryName);
      const newCategory = {
        id,
        name: newCategoryName,
        slug: newCategoryName.toLowerCase().replace(/\s+/g, "-")
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;
    try {
      await updateCategory(editingCategory.id, editingCategory.name);
      setCategories(categories.map(
        (cat) => cat.id === editingCategory.id ? { ...cat, name: editingCategory.name, slug: editingCategory.name.toLowerCase().replace(/\s+/g, "-") } : cat
      ));
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "sm:flex sm:items-center sm:justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Categories" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Create New Category" }),
      /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateCategory, className: "sm:flex sm:items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full sm:max-w-xs", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "newCategory", className: "sr-only", children: "Category Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "newCategory",
              value: newCategoryName,
              onChange: (e) => setNewCategoryName(e.target.value),
              className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
              placeholder: "Enter category name"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
            children: "Create"
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200", children: categories.map((category) => /* @__PURE__ */ jsx("li", { children: (editingCategory == null ? void 0 : editingCategory.id) === category.id ? /* @__PURE__ */ jsxs("form", { onSubmit: handleUpdateCategory, className: "px-4 py-4 sm:px-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: editingCategory.name,
          onChange: (e) => setEditingCategory({ ...editingCategory, name: e.target.value }),
          className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "ml-4 flex space-x-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "text-blue-600 hover:text-blue-900",
            children: "Save"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setEditingCategory(null),
            className: "text-gray-600 hover:text-gray-900",
            children: "Cancel"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "px-4 py-4 sm:px-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900", children: category.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "Slug: ",
          category.slug
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setEditingCategory(category),
            className: "text-blue-600 hover:text-blue-900",
            children: "Edit"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDeleteCategory(category.id),
            className: "text-red-600 hover:text-red-900",
            children: "Delete"
          }
        )
      ] })
    ] }) }, category.id)) }) })
  ] });
};
const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await getQuizzes();
        setQuizzes(data);
        setError(null);
      } catch (err) {
        setError("Failed to load quizzes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);
  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };
  const handleDeleteConfirm = async (id) => {
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete quiz. Please try again later.");
      console.error(err);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative", role: "alert", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 mr-2" }),
      /* @__PURE__ */ jsx("span", { children: error })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Quizzes" }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/admin/quizzes/new",
          className: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "w-5 h-5 mr-2" }),
            "New Quiz"
          ]
        }
      )
    ] }),
    quizzes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No quizzes found. Create your first quiz!" }) }) : /* @__PURE__ */ jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Title" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Questions" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Time (min)" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Difficulty" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Quiz Type" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Exam Board" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: quizzes.map((quiz) => {
        var _a2;
        return /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: quiz.title }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
              quiz.description.substring(0, 50),
              "..."
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: quiz.totalQuestions }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: quiz.timeInMinutes }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`, children: quiz.difficulty }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800", children: quiz.quizType === "mainsPyqs" ? "Mains PYQs" : quiz.quizType === "prelimsPractice" ? "Prelims Practice" : quiz.quizType === "mainsPractice" ? "Mains Practice" : quiz.quizType }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800", children: (_a2 = quiz.examBoard) == null ? void 0 : _a2.toUpperCase() }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: deleteConfirm === quiz.id ? /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDeleteConfirm(quiz.id),
                className: "text-red-600 hover:text-red-900",
                children: "Confirm"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleDeleteCancel,
                className: "text-gray-600 hover:text-gray-900",
                children: "Cancel"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/admin/quizzes/edit/${quiz.id}`,
                className: "text-indigo-600 hover:text-indigo-900",
                children: /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDeleteClick(quiz.id),
                className: "text-red-600 hover:text-red-900",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" })
              }
            )
          ] }) })
        ] }, quiz.id);
      }) })
    ] }) })
  ] });
};
const QuizForm = ({
  initialData,
  onSubmit,
  isLoading,
  isEditing
}) => {
  const [title, setTitle] = useState((initialData == null ? void 0 : initialData.title) || "");
  const [description, setDescription] = useState((initialData == null ? void 0 : initialData.description) || "");
  const [timeInMinutes, setTimeInMinutes] = useState((initialData == null ? void 0 : initialData.timeInMinutes) || 15);
  const [difficulty, setDifficulty] = useState((initialData == null ? void 0 : initialData.difficulty) || "medium");
  const [quizType, setQuizType] = useState((initialData == null ? void 0 : initialData.quizType) || "prelimsPractice");
  const [examBoard, setExamBoard] = useState((initialData == null ? void 0 : initialData.examBoard) || "upsc");
  const [questions, setQuestions] = useState(
    (initialData == null ? void 0 : initialData.questions) || [{ id: "", question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }]
  );
  const [errors, setErrors] = useState({});
  const totalQuestions = questions.length;
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (timeInMinutes <= 0) {
      newErrors.timeInMinutes = "Time must be greater than 0";
    }
    if (!examBoard) {
      newErrors.examBoard = "Exam board is required";
    }
    if (questions.length === 0) {
      newErrors.questions = "At least one question is required";
    }
    questions.forEach((question, index) => {
      var _a2, _b;
      if (!((_a2 = question.question) == null ? void 0 : _a2.trim())) {
        newErrors[`question_${index}`] = "Question text is required";
      }
      (_b = question.options) == null ? void 0 : _b.forEach((option, optionIndex) => {
        if (!option.trim()) {
          newErrors[`question_${index}_option_${optionIndex}`] = "Option text is required";
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: "", question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
    ]);
  };
  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    const options = [...newQuestions[questionIndex].options || []];
    options[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options };
    setQuestions(newQuestions);
  };
  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], correctAnswer: optionIndex };
    setQuestions(newQuestions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const quizData = {
      title,
      description,
      timeInMinutes,
      difficulty,
      quizType,
      examBoard,
      totalQuestions,
      questions
    };
    await onSubmit(quizData);
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isEditing ? "Edit Quiz" : "Create New Quiz" }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/admin/quizzes",
            className: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
              "Back"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 mr-2" }),
              isLoading ? "Saving..." : "Save Quiz"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow-md rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Quiz Title" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "title",
            value: title,
            onChange: (e) => setTitle(e.target.value),
            className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.title ? "border-red-300" : ""}`
          }
        ),
        errors.title && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "description",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            rows: 3,
            className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.description ? "border-red-300" : ""}`
          }
        ),
        errors.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "timeInMinutes", className: "block text-sm font-medium text-gray-700", children: "Time Limit (minutes)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              id: "timeInMinutes",
              value: timeInMinutes,
              onChange: (e) => setTimeInMinutes(parseInt(e.target.value)),
              min: "1",
              className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.timeInMinutes ? "border-red-300" : ""}`
            }
          ),
          errors.timeInMinutes && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.timeInMinutes })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "difficulty", className: "block text-sm font-medium text-gray-700", children: "Difficulty" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "difficulty",
              value: difficulty,
              onChange: (e) => setDifficulty(e.target.value),
              className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "easy", children: "Easy" }),
                /* @__PURE__ */ jsx("option", { value: "medium", children: "Medium" }),
                /* @__PURE__ */ jsx("option", { value: "hard", children: "Hard" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-3", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "quizType", className: "block text-sm font-medium text-gray-700", children: "Quiz Type" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "quizType",
            value: quizType,
            onChange: (e) => setQuizType(e.target.value),
            className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "prelimsPractice", children: "Prelims Practice" }),
              /* @__PURE__ */ jsx("option", { value: "mainsPractice", children: "Mains Practice" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-3", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "examBoard", className: "block text-sm font-medium text-gray-700", children: "Exam Board" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "examBoard",
            value: examBoard,
            onChange: (e) => setExamBoard(e.target.value),
            className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.examBoard ? "border-red-300" : ""}`,
            children: [
              /* @__PURE__ */ jsx("option", { value: "upsc", children: "UPSC" }),
              /* @__PURE__ */ jsx("option", { value: "tgpsc", children: "TGPSC" }),
              /* @__PURE__ */ jsx("option", { value: "appsc", children: "APPSC" })
            ]
          }
        ),
        errors.examBoard && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.examBoard })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Questions" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleAddQuestion,
            className: "inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
              "Add Question"
            ]
          }
        )
      ] }),
      errors.questions && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600 mb-4", children: errors.questions }),
      questions.map((question, questionIndex) => {
        var _a2;
        return /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-md rounded-lg p-6 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-medium text-gray-900", children: [
              "Question ",
              questionIndex + 1
            ] }),
            questions.length > 1 && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleRemoveQuestion(questionIndex),
                className: "text-red-600 hover:text-red-800",
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: `question-${questionIndex}`,
                  className: "block text-sm font-medium text-gray-700",
                  children: "Question Text"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: `question-${questionIndex}`,
                  value: question.question,
                  onChange: (e) => handleQuestionChange(questionIndex, "question", e.target.value),
                  className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors[`question_${questionIndex}`] ? "border-red-300" : ""}`
                }
              ),
              errors[`question_${questionIndex}`] && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors[`question_${questionIndex}`] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Options" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: (_a2 = question.options) == null ? void 0 : _a2.map((option, optionIndex) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    id: `question-${questionIndex}-option-${optionIndex}-correct`,
                    name: `question-${questionIndex}-correct`,
                    checked: question.correctAnswer === optionIndex,
                    onChange: () => handleCorrectAnswerChange(questionIndex, optionIndex),
                    className: "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    id: `question-${questionIndex}-option-${optionIndex}`,
                    value: option,
                    onChange: (e) => handleOptionChange(questionIndex, optionIndex, e.target.value),
                    className: `ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors[`question_${questionIndex}_option_${optionIndex}`] ? "border-red-300" : ""}`,
                    placeholder: `Option ${optionIndex + 1}`
                  }
                )
              ] }, optionIndex)) }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Select the radio button next to the correct answer." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: `question-${questionIndex}-explanation`,
                  className: "block text-sm font-medium text-gray-700",
                  children: "Explanation (Optional)"
                }
              ),
              /* @__PURE__ */ jsx(
                ClientOnlyRichTextEditor,
                {
                  value: question.explanation || "",
                  onChange: (value) => handleQuestionChange(questionIndex, "explanation", value),
                  placeholder: "Enter explanation for this question...",
                  rows: 3
                }
              )
            ] })
          ] })
        ] }, questionIndex);
      })
    ] })
  ] });
};
const QuizEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const isEditing = !!id;
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        setFetchLoading(true);
        const quizData = await getQuizById(id);
        if (!quizData) {
          setError("Quiz not found");
          return;
        }
        setQuiz(quizData);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz. Please try again later.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);
  const handleSubmit = async (quizData) => {
    try {
      setLoading(true);
      setError(null);
      if (isEditing && id) {
        await updateQuiz(id, quizData);
      } else {
        await createQuiz(quizData);
      }
      navigate("/admin/quizzes");
    } catch (err) {
      console.error("Error saving quiz:", err);
      setError("Failed to save quiz. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  if (fetchLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6", role: "alert", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 mr-2" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/admin/quizzes"),
          className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          children: "Back to Quizzes"
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: isEditing ? "Edit Quiz" : "Create New Quiz" }),
    /* @__PURE__ */ jsx(
      QuizForm,
      {
        initialData: quiz || void 0,
        onSubmit: handleSubmit,
        isLoading: loading,
        isEditing
      }
    )
  ] });
};
const QuizAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [filteredAttempts, setFilteredAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  useEffect(() => {
    const fetchQuizAttempts2 = async () => {
      try {
        setLoading(true);
        const attemptsQuery = query(
          collection(db, "quizAttempts"),
          orderBy("completedAt", "desc")
        );
        const querySnapshot = await getDocs(attemptsQuery);
        const attemptsList = [];
        querySnapshot.forEach((doc2) => {
          const data = doc2.data();
          attemptsList.push({
            id: doc2.id,
            userId: data.userId,
            userEmail: data.userEmail || "Unknown",
            userDisplayName: data.userDisplayName || "Unknown User",
            quizId: data.quizId,
            quizTitle: data.quizTitle,
            score: data.score,
            totalQuestions: data.totalQuestions,
            timeTaken: data.timeTaken,
            completedAt: data.completedAt.toDate(),
            device: data.device,
            answers: data.answers
          });
        });
        setAttempts(attemptsList);
        setFilteredAttempts(attemptsList);
      } catch (err) {
        console.error("Error fetching quiz attempts:", err);
        setError("Failed to load quiz attempts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAttempts2();
  }, []);
  useEffect(() => {
    let filtered = [...attempts];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (attempt) => attempt.userDisplayName.toLowerCase().includes(term) || attempt.userEmail.toLowerCase().includes(term) || attempt.quizTitle.toLowerCase().includes(term)
      );
    }
    if (dateFilter !== "all") {
      const now = /* @__PURE__ */ new Date();
      let startDate;
      switch (dateFilter) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "custom":
          if (fromDate && toDate) {
            const fromDateTime = new Date(fromDate);
            fromDateTime.setHours(0, 0, 0, 0);
            const toDateTime = new Date(toDate);
            toDateTime.setHours(23, 59, 59, 999);
            filtered = filtered.filter((attempt) => {
              const attemptDate = attempt.completedAt;
              return attemptDate >= fromDateTime && attemptDate <= toDateTime;
            });
          } else if (fromDate) {
            const fromDateTime = new Date(fromDate);
            fromDateTime.setHours(0, 0, 0, 0);
            filtered = filtered.filter((attempt) => attempt.completedAt >= fromDateTime);
          } else if (toDate) {
            const toDateTime = new Date(toDate);
            toDateTime.setHours(23, 59, 59, 999);
            filtered = filtered.filter((attempt) => attempt.completedAt <= toDateTime);
          }
          return;
        default:
          startDate = /* @__PURE__ */ new Date(0);
      }
      if (dateFilter !== "custom") {
        filtered = filtered.filter((attempt) => attempt.completedAt >= startDate);
      }
    }
    if (scoreFilter !== "all") {
      switch (scoreFilter) {
        case "high":
          filtered = filtered.filter(
            (attempt) => attempt.score / attempt.totalQuestions * 100 >= 80
          );
          break;
        case "medium":
          filtered = filtered.filter((attempt) => {
            const percentage = attempt.score / attempt.totalQuestions * 100;
            return percentage >= 50 && percentage < 80;
          });
          break;
        case "low":
          filtered = filtered.filter(
            (attempt) => attempt.score / attempt.totalQuestions * 100 < 50
          );
          break;
      }
    }
    setFilteredAttempts(filtered);
  }, [searchTerm, dateFilter, scoreFilter, attempts, fromDate, toDate]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };
  const exportToCSV = () => {
    let csv = "User,Email,Quiz,Score,Percentage,Time Taken,Completed At\n";
    filteredAttempts.forEach((attempt) => {
      const percentage = Math.round(attempt.score / attempt.totalQuestions * 100);
      const row = [
        `"${attempt.userDisplayName}"`,
        `"${attempt.userEmail}"`,
        `"${attempt.quizTitle}"`,
        `${attempt.score}/${attempt.totalQuestions}`,
        `${percentage}%`,
        formatTime(attempt.timeTaken),
        formatDate(attempt.completedAt)
      ].join(",");
      csv += row + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `quiz-attempts-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [
      /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "Error!" }),
      /* @__PURE__ */ jsxs("span", { className: "block sm:inline", children: [
        " ",
        error
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Quiz Attempts" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: exportToCSV,
          className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          children: [
            /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-2" }),
            "Export to CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white p-4 shadow rounded-lg mb-6", children: /* @__PURE__ */ jsxs("div", { className: `grid grid-cols-1 gap-4 ${dateFilter === "custom" ? "md:grid-cols-6" : "md:grid-cols-4"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-gray-400" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
            placeholder: "Search users or quizzes",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "date-filter", className: "block text-sm font-medium text-gray-700", children: "Date" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "date-filter",
            className: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
            value: dateFilter,
            onChange: (e) => setDateFilter(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Time" }),
              /* @__PURE__ */ jsx("option", { value: "today", children: "Today" }),
              /* @__PURE__ */ jsx("option", { value: "week", children: "Last 7 Days" }),
              /* @__PURE__ */ jsx("option", { value: "month", children: "Last 30 Days" }),
              /* @__PURE__ */ jsx("option", { value: "custom", children: "Custom Date Range" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "score-filter", className: "block text-sm font-medium text-gray-700", children: "Score" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "score-filter",
            className: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
            value: scoreFilter,
            onChange: (e) => setScoreFilter(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Scores" }),
              /* @__PURE__ */ jsx("option", { value: "high", children: "High (80%+)" }),
              /* @__PURE__ */ jsx("option", { value: "medium", children: "Medium (50-79%)" }),
              /* @__PURE__ */ jsx("option", { value: "low", children: "Low (Below 50%)" })
            ]
          }
        )
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
        "Showing ",
        filteredAttempts.length,
        " of ",
        attempts.length,
        " attempts"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: filteredAttempts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-5 sm:p-6 text-center text-gray-500", children: "No quiz attempts match your filters." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200", children: filteredAttempts.map((attempt) => /* @__PURE__ */ jsx("li", { className: "hover:bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(User, { className: "h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" }) }),
          /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-indigo-600", children: attempt.userDisplayName }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: attempt.userEmail })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ml-2 flex-shrink-0 flex", children: /* @__PURE__ */ jsxs("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attempt.score / attempt.totalQuestions * 100 >= 70 ? "bg-green-100 text-green-800" : attempt.score / attempt.totalQuestions * 100 >= 40 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`, children: [
          attempt.score,
          "/",
          attempt.totalQuestions,
          " (",
          Math.round(attempt.score / attempt.totalQuestions * 100),
          "%)"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 sm:flex sm:justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "sm:flex", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [
          /* @__PURE__ */ jsx("span", { className: "mr-1 font-medium", children: "Quiz:" }),
          " ",
          attempt.quizTitle
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: [
          /* @__PURE__ */ jsx(Clock, { className: "flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" }),
          /* @__PURE__ */ jsxs("span", { className: "mr-4", children: [
            "Time: ",
            formatTime(attempt.timeTaken)
          ] }),
          /* @__PURE__ */ jsx(Calendar, { className: "flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Completed: ",
            formatDate(attempt.completedAt)
          ] })
        ] })
      ] }),
      attempt.device && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-gray-500", children: [
        "Device: ",
        attempt.device.platform,
        " • ",
        attempt.device.userAgent.substring(0, 50),
        "..."
      ] })
    ] }) }, attempt.id)) }) })
  ] });
};
const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    fetchBanners();
  }, []);
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBanners = await getBanners();
      setBanners(fetchedBanners);
    } catch (error2) {
      console.error("Error fetching banners:", error2);
      setError("Failed to load banners. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  const resetForm = () => {
    setTitle("");
    setLink("");
    setActive(true);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select an image for the banner");
      return;
    }
    try {
      setLoading(true);
      await createBanner(imageFile, { title, link, active });
      setSuccessMessage("Banner created successfully!");
      setIsCreating(false);
      resetForm();
      fetchBanners();
    } catch (error2) {
      console.error("Error creating banner:", error2);
      setError("Failed to create banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;
    try {
      setLoading(true);
      await updateBanner(
        isEditing,
        { title, link, active },
        imageFile || void 0
      );
      setSuccessMessage("Banner updated successfully!");
      setIsEditing(null);
      resetForm();
      fetchBanners();
    } catch (error2) {
      console.error("Error updating banner:", error2);
      setError("Failed to update banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }
    try {
      setLoading(true);
      await deleteBanner(id, imageUrl);
      setSuccessMessage("Banner deleted successfully!");
      fetchBanners();
    } catch (error2) {
      console.error("Error deleting banner:", error2);
      setError("Failed to delete banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleToggleActive = async (id, newActiveState) => {
    try {
      setLoading(true);
      await updateBanner(id, { active: newActiveState });
      setSuccessMessage(`Banner ${newActiveState ? "activated" : "deactivated"} successfully!`);
      fetchBanners();
    } catch (error2) {
      console.error("Error toggling banner active state:", error2);
      setError("Failed to update banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleMoveUp = async (index) => {
    if (index <= 0) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
    try {
      setLoading(true);
      await reorderBanners(newBanners.map((banner) => banner.id));
      setBanners(newBanners);
      setSuccessMessage("Banner order updated successfully!");
    } catch (error2) {
      console.error("Error reordering banners:", error2);
      setError("Failed to reorder banners. Please try again.");
      fetchBanners();
    } finally {
      setLoading(false);
    }
  };
  const handleMoveDown = async (index) => {
    if (index >= banners.length - 1) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    try {
      setLoading(true);
      await reorderBanners(newBanners.map((banner) => banner.id));
      setBanners(newBanners);
      setSuccessMessage("Banner order updated successfully!");
    } catch (error2) {
      console.error("Error reordering banners:", error2);
      setError("Failed to reorder banners. Please try again.");
      fetchBanners();
    } finally {
      setLoading(false);
    }
  };
  const startEditing = (banner) => {
    setIsEditing(banner.id);
    setTitle(banner.title || "");
    setLink(banner.link);
    setActive(banner.active);
    setImageFile(null);
  };
  const cancelEditing = () => {
    setIsEditing(null);
    resetForm();
  };
  const cancelCreating = () => {
    setIsCreating(false);
    resetForm();
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Manage Banners" }),
      !isCreating && !isEditing && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsCreating(true),
          className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "w-4 h-4 mr-2" }),
            "Add New Banner"
          ]
        }
      )
    ] }),
    successMessage && /* @__PURE__ */ jsx("div", { className: "bg-green-50 border-l-4 border-green-400 p-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-green-700", children: successMessage }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSuccessMessage(null),
          className: "text-green-700",
          children: "×"
        }
      )
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: error }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setError(null),
          className: "text-red-700",
          children: "×"
        }
      )
    ] }) }),
    isCreating && /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-md rounded-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Add New Banner" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-1", children: "Title (Optional)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                id: "title",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "For internal reference only, will not be displayed on the banner." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "link", className: "block text-sm font-medium text-gray-700 mb-1", children: "Link URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                id: "link",
                value: link,
                onChange: (e) => setLink(e.target.value),
                className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "image", className: "block text-sm font-medium text-gray-700 mb-1", children: "Banner Image" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                id: "image",
                ref: fileInputRef,
                onChange: handleFileChange,
                accept: "image/*",
                className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
                required: true
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Recommended size: 1920 x 600 pixels" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "active",
                checked: active,
                onChange: (e) => setActive(e.target.checked),
                className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "active", className: "ml-2 block text-sm text-gray-700", children: "Active (visible on the website)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: cancelCreating,
              className: "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50",
              children: loading ? "Creating..." : "Create Banner"
            }
          )
        ] })
      ] })
    ] }),
    isEditing && /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-md rounded-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Edit Banner" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleEditSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "edit-title", className: "block text-sm font-medium text-gray-700 mb-1", children: "Title (Optional)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                id: "edit-title",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "For internal reference only, will not be displayed on the banner." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "edit-link", className: "block text-sm font-medium text-gray-700 mb-1", children: "Link URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                id: "edit-link",
                value: link,
                onChange: (e) => setLink(e.target.value),
                className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "edit-image", className: "block text-sm font-medium text-gray-700 mb-1", children: "Banner Image (Leave empty to keep current image)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                id: "edit-image",
                ref: fileInputRef,
                onChange: handleFileChange,
                accept: "image/*",
                className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Recommended size: 1920 x 600 pixels" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "edit-active",
                checked: active,
                onChange: (e) => setActive(e.target.checked),
                className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "edit-active", className: "ml-2 block text-sm text-gray-700", children: "Active (visible on the website)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: cancelEditing,
              className: "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50",
              children: loading ? "Updating..." : "Update Banner"
            }
          )
        ] })
      ] })
    ] }),
    loading && !isCreating && !isEditing ? /* @__PURE__ */ jsx("div", { className: "text-center py-10", children: /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "Loading banners..." }) }) : /* @__PURE__ */ jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: banners.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-gray-500", children: 'No banners found. Click "Add New Banner" to create one.' }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Image" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Title/Description" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Link" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Order" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: banners.map((banner, index) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-32 overflow-hidden rounded-md bg-gray-100", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: getProxiedImageUrl(banner.imageUrl),
            alt: banner.title || `Banner ${index + 1}`,
            className: "h-full w-full object-cover"
          }
        ) }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: banner.title || /* @__PURE__ */ jsx("span", { className: "text-gray-400 italic", children: "No title" }) }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: banner.link,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-sm text-blue-600 hover:text-blue-800 underline",
            children: banner.link
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${banner.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`,
            children: banner.active ? "Active" : "Inactive"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleMoveUp(index),
              disabled: index === 0,
              className: `p-1 rounded-full ${index === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`,
              children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleMoveDown(index),
              disabled: index === banners.length - 1,
              className: `p-1 rounded-full ${index === banners.length - 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`,
              children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: index + 1 })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleToggleActive(banner.id, !banner.active),
              className: "text-gray-500 hover:text-gray-700 p-1",
              title: banner.active ? "Deactivate" : "Activate",
              children: banner.active ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => startEditing(banner),
              className: "text-blue-500 hover:text-blue-700 p-1",
              title: "Edit",
              children: /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(banner.id, banner.imageUrl),
              className: "text-red-500 hover:text-red-700 p-1",
              title: "Delete",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" })
            }
          )
        ] }) })
      ] }, banner.id)) })
    ] }) }) })
  ] });
};
const handleFirestoreError = (error, operation) => {
  console.error(`Error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};
const getCustomPages = async () => {
  try {
    const pagesRef = collection(db, "custom_pages");
    const q = query(pagesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    handleFirestoreError(error, "fetch custom pages");
    return [];
  }
};
const getCustomPage = async (id) => {
  try {
    const docRef = doc(db, "custom_pages", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleFirestoreError(error, "fetch custom page");
    return null;
  }
};
const getCustomPageBySlug = async (slug) => {
  try {
    const pagesRef = collection(db, "custom_pages");
    const q = query(pagesRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc2 = snapshot.docs[0];
    return { id: doc2.id, ...doc2.data() };
  } catch (error) {
    handleFirestoreError(error, "fetch custom page by slug");
    return null;
  }
};
const createCustomPage = async (data) => {
  try {
    const pagesRef = collection(db, "custom_pages");
    const slug = data.slug || slugify(data.title, { lower: true, strict: true });
    const now = Timestamp.now().toMillis();
    const slugCheck = await getCustomPageBySlug(slug);
    if (slugCheck) {
      throw new Error("A page with this slug already exists");
    }
    const page = {
      ...data,
      slug,
      createdAt: now,
      updatedAt: now
    };
    const docRef = await addDoc(pagesRef, page);
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError(error, "create custom page");
    return "";
  }
};
const updateCustomPage = async (id, data) => {
  try {
    const docRef = doc(db, "custom_pages", id);
    const updates = {
      ...data,
      updatedAt: Timestamp.now().toMillis()
    };
    if (data.title && !data.slug) {
      updates.slug = slugify(data.title, { lower: true, strict: true });
      const slugCheck = await getCustomPageBySlug(updates.slug);
      if (slugCheck && slugCheck.id !== id) {
        throw new Error("A page with this slug already exists");
      }
    }
    await updateDoc(docRef, updates);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError(error, "update custom page");
  }
};
const deleteCustomPage = async (id) => {
  try {
    const docRef = doc(db, "custom_pages", id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, "delete custom page");
  }
};
const CustomPageEditor = ({
  page,
  categories,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState((page == null ? void 0 : page.title) || "");
  const [slug, setSlug] = useState((page == null ? void 0 : page.slug) || "");
  const [description, setDescription] = useState((page == null ? void 0 : page.description) || "");
  const [content, setContent] = useState((page == null ? void 0 : page.content) || "");
  const [selectedCategories, setSelectedCategories] = useState((page == null ? void 0 : page.categories) || []);
  const [published, setPublished] = useState((page == null ? void 0 : page.published) ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [titleTouched, setTitleTouched] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  useEffect(() => {
    if (title && !slugTouched) {
      setSlug(slugify(title, { lower: true, strict: true }));
    }
  }, [title, slugTouched]);
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleTouched(true);
  };
  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setSlugTouched(true);
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!slug) {
      setError("Slug is required");
      return;
    }
    const formData = {
      title,
      slug,
      description,
      content,
      categories: selectedCategories,
      published
    };
    setLoading(true);
    setError(null);
    try {
      let savedPage = null;
      if (page) {
        await updateCustomPage(page.id, formData);
        savedPage = await getCustomPage(page.id);
      } else {
        const newPageId = await createCustomPage(formData);
        savedPage = await getCustomPage(newPageId);
      }
      if (savedPage) {
        onSave(savedPage);
      } else {
        throw new Error("Failed to save page");
      }
    } catch (err) {
      console.error("Error saving page:", err);
      setError(err instanceof Error ? err.message : "Failed to save page");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onCancel,
          className: "mr-4 text-gray-600 hover:text-gray-900",
          children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: page ? "Edit Page" : "Create New Page" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6", role: "alert", children: error }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white shadow-md rounded-lg overflow-hidden p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-1", children: "Page Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "title",
              value: title,
              onChange: handleTitleChange,
              className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border",
              placeholder: "Enter page title",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "slug", className: "block text-sm font-medium text-gray-700 mb-1", children: "Page Slug" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 mr-1", children: "yourdomain.com/" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                id: "slug",
                value: slug,
                onChange: handleSlugChange,
                className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border",
                placeholder: "page-slug",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "The URL-friendly name for your page (auto-generated from title). Pages will be accessible directly at the root URL." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-1", children: "Description (Optional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "description",
              value: description,
              onChange: (e) => setDescription(e.target.value),
              rows: 3,
              className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border",
              placeholder: "Enter page description"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "content", className: "block text-sm font-medium text-gray-700 mb-1", children: "Page Content (HTML)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "content",
              value: content,
              onChange: (e) => setContent(e.target.value),
              rows: 8,
              className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border",
              placeholder: "Enter HTML content for this page"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "If no categories are selected, this content will be displayed as the page content." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Categories (Optional)" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2", children: categories.map((category) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: `category-${category.id}`,
                checked: selectedCategories.includes(category.id),
                onChange: () => handleCategoryChange(category.id),
                className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: `category-${category.id}`, className: "ml-2 block text-sm text-gray-900", children: category.name })
          ] }, category.id)) }),
          categories.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-2", children: "No categories available. Create categories to organize your pages." }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-2", children: "If categories are selected, the page will display posts from these categories." })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: "published",
              checked: published,
              onChange: (e) => setPublished(e.target.checked),
              className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "published", className: "ml-2 block text-sm text-gray-900", children: "Publish this page (make it visible to users)" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            className: "bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" }),
              "Saving..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 mr-2" }),
              "Save Page"
            ] })
          }
        )
      ] })
    ] })
  ] });
};
const CustomPages = () => {
  const [pages, setPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pagesData, categoriesData] = await Promise.all([
          getCustomPages(),
          getCategories()
        ]);
        setPages(pagesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };
  const handleDeleteConfirm = async (id) => {
    try {
      await deleteCustomPage(id);
      setPages(pages.filter((page) => page.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete page. Please try again later.");
      console.error(err);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };
  const handleEditClick = (id) => {
    setIsEditing(id);
  };
  const handleCreate = () => {
    setIsCreating(true);
  };
  const handlePageUpdated = (updatedPage) => {
    const existingIndex = pages.findIndex((p) => p.id === updatedPage.id);
    if (existingIndex >= 0) {
      const updatedPages = [...pages];
      updatedPages[existingIndex] = updatedPage;
      setPages(updatedPages);
    } else {
      setPages([updatedPage, ...pages]);
    }
    setIsEditing(null);
    setIsCreating(false);
  };
  const handleCancel = () => {
    setIsEditing(null);
    setIsCreating(false);
  };
  if (isCreating) {
    return /* @__PURE__ */ jsx(
      CustomPageEditor,
      {
        categories,
        onSave: handlePageUpdated,
        onCancel: handleCancel
      }
    );
  }
  if (isEditing) {
    const pageToEdit = pages.find((page) => page.id === isEditing);
    if (!pageToEdit) return /* @__PURE__ */ jsx("div", { children: "Page not found" });
    return /* @__PURE__ */ jsx(
      CustomPageEditor,
      {
        page: pageToEdit,
        categories,
        onSave: handlePageUpdated,
        onCancel: handleCancel
      }
    );
  }
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative", role: "alert", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 mr-2" }),
      /* @__PURE__ */ jsx("span", { children: error })
    ] }) });
  }
  const getCategoryNames = (categoryIds) => {
    return categoryIds.map((id) => {
      var _a2;
      return ((_a2 = categories.find((cat) => cat.id === id)) == null ? void 0 : _a2.name) || "";
    }).filter(Boolean).join(", ");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Custom Pages" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleCreate,
          className: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "w-5 h-5 mr-2" }),
            "New Page"
          ]
        }
      )
    ] }),
    pages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No custom pages found. Create your first page!" }) }) : /* @__PURE__ */ jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Title" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Slug" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Categories" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: pages.map((page) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: page.title }),
          page.description && /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
            page.description.substring(0, 50),
            "..."
          ] })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/${page.slug}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-600 hover:underline",
            children: [
              "/",
              page.slug
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: getCategoryNames(page.categories) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${page.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, children: page.published ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-3 h-3 mr-1" }),
          " Published"
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(EyeOff, { className: "w-3 h-3 mr-1" }),
          " Draft"
        ] }) }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: deleteConfirm === page.id ? /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDeleteConfirm(page.id),
              className: "text-red-600 hover:text-red-900",
              children: "Confirm"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleDeleteCancel,
              className: "text-gray-600 hover:text-gray-900",
              children: "Cancel"
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleEditClick(page.id),
              className: "text-indigo-600 hover:text-indigo-900",
              children: /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDeleteClick(page.id),
              className: "text-red-600 hover:text-red-900",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" })
            }
          )
        ] }) })
      ] }, page.id)) })
    ] }) })
  ] });
};
const KNOWN_ROUTES = [
  "upsc-notes",
  "appsc-notes",
  "tgpsc-notes",
  "notes",
  "quizzes",
  "quiz",
  "login",
  "profile",
  "category",
  "admin",
  "pages",
  "courses",
  "blogs"
];
const updateMetaTags = (title, description, imageUrl) => {
  if (typeof document === "undefined") return;
  document.title = `${title} | Epitome IAS`;
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute("content", description);
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute("content", title);
  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement("meta");
    ogDescription.setAttribute("property", "og:description");
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute("content", description);
};
const CustomPageView = ({ isExamPage, initialData }) => {
  const { slug } = useParams();
  const location = useLocation();
  const [page, setPage] = useState(null);
  const [blogPost, setBlogPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  const [contentType, setContentType] = useState("none");
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (initialData) {
      if (initialData.page) {
        console.log("CustomPageView: Using SSR data for custom page:", initialData.page.title);
        setPage(initialData.page);
        setContentType("custom");
        setPageTitle(initialData.page.title);
        setLoading(false);
        updateMetaTags(
          initialData.page.title,
          initialData.page.description || "Custom page from Epitome IAS"
        );
      } else if (initialData.post) {
        console.log("CustomPageView: Using SSR data for post:", initialData.post.title);
        setBlogPost(initialData.post);
        setPosts(initialData.allPosts || []);
        setCategories(initialData.categories || []);
        setContentType("blog");
        setPageTitle(initialData.post.title);
        setLoading(false);
        updateMetaTags(
          initialData.post.title,
          initialData.post.excerpt || "Read this informative article from Epitome IAS"
        );
      }
    }
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isExamPage) {
          let title = "";
          let pageSlug = "";
          if (isExamPage === "upsc") {
            title = "UPSC Notes";
            pageSlug = "upsc-notes";
          } else if (isExamPage === "appsc") {
            title = "APPSC Notes";
            pageSlug = "appsc-notes";
          } else if (isExamPage === "tgpsc") {
            title = "TGPSC Notes";
            pageSlug = "tgpsc-notes";
          }
          setPageTitle(title);
          const [customPageData2, postsData2, categoriesData2] = await Promise.all([
            getCustomPageBySlug(pageSlug).catch((err) => {
              console.log(`No custom page found for ${pageSlug}:`, err);
              return null;
            }),
            getPublishedPosts(),
            getCategories()
          ]);
          console.log(`Exam page custom page data:`, customPageData2);
          setPosts(postsData2);
          setCategories(categoriesData2);
          if (customPageData2) {
            setPage(customPageData2);
            setContentType("custom");
            console.log(`Found custom page for ${pageSlug} with categories:`, customPageData2.categories);
          } else {
            setContentType("exam");
            console.log(`No custom page found for ${pageSlug}, showing all categories`);
          }
          updateMetaTags(
            title,
            `Study material and notes for ${title}`
          );
          setLoading(false);
          return;
        }
        if (!slug) {
          throw new Error("Page slug is required");
        }
        console.log(`Fetching data for slug: ${slug}`);
        if (KNOWN_ROUTES.includes(slug)) {
          console.log(`${slug} is a known route, redirecting`);
          setShouldRedirect(true);
          return;
        }
        const [customPageData, blogPostData, postsData, categoriesData] = await Promise.all([
          getCustomPageBySlug(slug).catch((err) => {
            console.log(`Error fetching custom page: ${err}`);
            return null;
          }),
          getBlogPostBySlug(slug).catch((err) => {
            console.log(`Error fetching blog post: ${err}`);
            return null;
          }),
          getPublishedPosts(),
          getCategories()
        ]);
        console.log(`Custom page data: ${customPageData ? "found" : "not found"}`);
        console.log(`Blog post data: ${blogPostData ? "found" : "not found"}`);
        setPage(customPageData);
        setBlogPost(blogPostData);
        setPosts(postsData);
        setCategories(categoriesData);
        if (customPageData) {
          console.log("Setting content type to custom");
          setContentType("custom");
          updateMetaTags(
            customPageData.title,
            customPageData.description || "Explore this custom page from Epitome IAS"
          );
        } else if (blogPostData) {
          console.log("Setting content type to blog");
          setContentType("blog");
        } else {
          console.log("No content found, redirecting to home");
          setShouldRedirect(true);
          setRedirectPath("/");
          return;
        }
        setError(null);
      } catch (err) {
        console.error("Error loading content:", err);
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    setPage(null);
    setBlogPost(null);
    setContentType("none");
    setShouldRedirect(false);
    setError(null);
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, [isClient, slug, location.pathname, isExamPage]);
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.title = "Epitome IAS";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute("content", "Epitome IAS - Your learning partner for UPSC, TGPSC and APPSC competitive exams.");
        }
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute("content", "Epitome IAS");
        }
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute("content", "Epitome IAS - Your learning partner for competitive exams.");
        }
      }
    };
  }, []);
  const getPostsByCategory = (categoryId) => {
    return posts.filter((post) => post.categories.includes(categoryId));
  };
  const getRandomPostsForCategory = (categoryId) => {
    const categoryPosts = getPostsByCategory(categoryId);
    const maxPosts = Math.min(categoryPosts.length, Math.floor(Math.random() * 6) + 10);
    return categoryPosts.slice(0, maxPosts);
  };
  const getFilteredCategories = () => {
    if (contentType === "custom" && page) {
      console.log("Custom page categories:", page.categories);
      console.log("Available categories:", categories.map((c) => ({ id: c.id, name: c.name })));
      const categoriesWithPostCounts = page.categories.map((catId) => {
        const category = categories.find((c) => c.id === catId);
        const postCount = posts.filter((p) => p.categories.includes(catId)).length;
        return {
          id: catId,
          name: (category == null ? void 0 : category.name) || "Unknown",
          postCount
        };
      });
      console.log("Categories with post counts:", categoriesWithPostCounts);
      return categories.filter(
        (category) => page.categories.includes(category.id)
      );
    } else if (contentType === "exam" && isExamPage) {
      console.log("Exam page type:", isExamPage);
      console.log("All categories:", categories.map((c) => ({ id: c.id, name: c.name })));
      console.log("All posts:", posts.length);
      console.log("Posts by category:", categories.map((c) => ({
        category: c.name,
        postCount: posts.filter((p) => p.categories.includes(c.id)).length
      })));
      return categories.filter(
        (category) => posts.some((post) => post.categories.includes(category.id))
      );
    }
    return [];
  };
  const filteredCategories = getFilteredCategories();
  if (shouldRedirect) {
    console.log(`Redirecting to ${redirectPath}`);
    return /* @__PURE__ */ jsx(Navigate, { to: redirectPath, replace: true });
  }
  if (loading && isClient) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  if (contentType === "blog" && blogPost) {
    return /* @__PURE__ */ jsx(BlogPost, {});
  }
  if (error || contentType === "none" && !isExamPage) {
    return /* @__PURE__ */ jsx("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Error!" }),
      /* @__PURE__ */ jsx("div", { children: error || "Page not found" }),
      /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "text-red-700 underline", children: "Return to home page" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: contentType === "exam" ? pageTitle : page == null ? void 0 : page.title }),
    contentType === "custom" && (page == null ? void 0 : page.description) && /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 mb-8", children: page.description }),
    filteredCategories.length > 0 ? /* @__PURE__ */ jsx("div", { className: "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6", children: filteredCategories.map((category) => {
      const categoryPosts = getPostsByCategory(category.id);
      getRandomPostsForCategory(category.id);
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 break-inside-avoid-column hover:shadow-xl transition-shadow duration-300",
          children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 flex items-center", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: category.name }) }),
            /* @__PURE__ */ jsx("div", { className: "p-5", children: categoryPosts.length > 0 ? /* @__PURE__ */ jsx(
              Link,
              {
                to: `/${categoryPosts[0].slug}`,
                className: "text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow",
                children: "Explore More"
              }
            ) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 italic", children: "No posts available in this category yet." }) })
          ]
        },
        category.id
      );
    }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-600", children: "No categories found" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4", children: contentType === "exam" ? `Please create categories and assign posts to them for ${pageTitle}` : `This page (${(page == null ? void 0 : page.title) || slug}) exists but has no categories assigned to it. Please edit it in the admin panel to add categories.` }),
      isExamPage && /* @__PURE__ */ jsxs("div", { className: "mt-6 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto text-left", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-medium mb-2", children: "How to fix this:" }),
        /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-2 text-sm text-gray-700", children: [
          /* @__PURE__ */ jsx("li", { children: "Go to Admin Panel → Custom Pages" }),
          /* @__PURE__ */ jsxs("li", { children: [
            'Create a new page with the slug "',
            isExamPage === "upsc" ? "upsc-notes" : isExamPage === "appsc" ? "appsc-notes" : "tgpsc-notes",
            '"'
          ] }),
          /* @__PURE__ */ jsx("li", { children: "Assign relevant categories to this page" }),
          /* @__PURE__ */ jsx("li", { children: "Make sure these categories have posts assigned to them" }),
          /* @__PURE__ */ jsx("li", { children: "Publish the page" })
        ] })
      ] })
    ] })
  ] });
};
CustomPageView.defaultProps = {
  isExamPage: void 0
};
const PrelimsMCQs = () => {
  const [showPaperForm, setShowPaperForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: "",
    year: (/* @__PURE__ */ new Date()).getFullYear(),
    examType: "upsc",
    paperType: "prelims"
  });
  const [newChapter, setNewChapter] = useState({
    title: "",
    order: 1
  });
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showError = error ? /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-4", children: /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: error }) }) }) }) : null;
  const [expandedPapers, setExpandedPapers] = useState({});
  const [currentMCQ, setCurrentMCQ] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: 0,
    explanation: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [examTypes] = useState(["upsc", "tgpsc", "appsc"]);
  const [selectedExamType, setSelectedExamType] = useState("upsc");
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "pyqPapers"),
          where("examType", "==", selectedExamType),
          where("paperType", "==", "prelims")
        );
        const querySnapshot = await getDocs(q);
        const papersData = [];
        for (const docRef of querySnapshot.docs) {
          const data = docRef.data();
          papersData.push({
            id: docRef.id,
            title: data.title,
            year: data.year,
            examType: data.examType,
            paperType: data.paperType,
            chapters: data.chapters || []
          });
        }
        papersData.sort((a, b) => b.year - a.year);
        setPapers(papersData);
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError("Failed to load papers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [selectedExamType]);
  useEffect(() => {
    const fetchMCQs = async () => {
      if (!selectedPaper || !selectedChapter) {
        setMcqs([]);
        return;
      }
      try {
        setLoading(true);
        const q = query(
          collection(db, "prelimsMCQs"),
          where("paperId", "==", selectedPaper.id),
          where("chapterId", "==", selectedChapter.id)
        );
        const querySnapshot = await getDocs(q);
        const mcqsData = [];
        querySnapshot.forEach((doc2) => {
          const data = doc2.data();
          mcqsData.push({
            id: doc2.id,
            question: data.question,
            options: data.options,
            correctOption: data.correctOption,
            explanation: data.explanation
          });
        });
        setMcqs(mcqsData);
      } catch (err) {
        console.error("Error fetching MCQs:", err);
        setError("Failed to load MCQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMCQs();
  }, [selectedPaper, selectedChapter]);
  const handlePaperSelect = async (paper) => {
    setExpandedPapers((prev) => ({
      ...prev,
      [paper.id]: !prev[paper.id]
    }));
    setSelectedPaper(paper);
    setSelectedChapter(null);
  };
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    resetForm();
  };
  const resetForm = () => {
    setCurrentMCQ({
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
      explanation: ""
    });
    setIsEditing(false);
    setEditingId(null);
  };
  const handleAddPaper = async () => {
    if (!newPaper.title || newPaper.year <= 0) {
      setError("Please provide a valid paper title and year");
      return;
    }
    try {
      setLoading(true);
      const paperData = {
        title: newPaper.title,
        year: newPaper.year,
        examType: selectedExamType,
        paperType: "prelims",
        chapters: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "pyqPapers"), paperData);
      const newPaperWithId = {
        id: docRef.id,
        ...paperData,
        chapters: []
      };
      setPapers((prev) => [...prev, newPaperWithId]);
      setNewPaper({
        title: "",
        year: (/* @__PURE__ */ new Date()).getFullYear(),
        examType: selectedExamType,
        paperType: "prelims"
      });
      setShowPaperForm(false);
    } catch (err) {
      console.error("Error adding paper:", err);
      setError("Failed to add paper. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleAddChapter = async () => {
    if (!selectedPaper || !newChapter.title) {
      setError("Please select a paper and provide a chapter title");
      return;
    }
    try {
      setLoading(true);
      const chapterId = crypto.randomUUID();
      const newChapterObj = {
        id: chapterId,
        title: newChapter.title,
        order: newChapter.order
      };
      const updatedChapters = [...selectedPaper.chapters || [], newChapterObj];
      await updateDoc(doc(db, "pyqPapers", selectedPaper.id), {
        chapters: updatedChapters,
        updatedAt: serverTimestamp()
      });
      const updatedPaper = {
        ...selectedPaper,
        chapters: updatedChapters
      };
      setPapers((prev) => prev.map(
        (paper) => paper.id === selectedPaper.id ? updatedPaper : paper
      ));
      setSelectedPaper(updatedPaper);
      setNewChapter({
        title: "",
        order: updatedChapters.length + 1
      });
      setShowChapterForm(false);
    } catch (err) {
      console.error("Error adding chapter:", err);
      setError("Failed to add chapter. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePaper = async (paperId) => {
    if (!window.confirm("Are you sure you want to delete this paper? This will delete all associated MCQs and cannot be undone.")) {
      return;
    }
    try {
      setLoading(true);
      await deleteDoc(doc(db, "pyqPapers", paperId));
      const mcqsQuery = query(
        collection(db, "prelimsMCQs"),
        where("paperId", "==", paperId)
      );
      const mcqsSnapshot = await getDocs(mcqsQuery);
      const deletePromises = mcqsSnapshot.docs.map((doc2) => deleteDoc(doc2.ref));
      await Promise.all(deletePromises);
      setPapers((prev) => prev.filter((paper) => paper.id !== paperId));
      if ((selectedPaper == null ? void 0 : selectedPaper.id) === paperId) {
        setSelectedPaper(null);
        setSelectedChapter(null);
        resetForm();
      }
    } catch (err) {
      console.error("Error deleting paper:", err);
      setError("Failed to delete paper. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteChapter = async (chapterId) => {
    if (!selectedPaper) return;
    if (!window.confirm("Are you sure you want to delete this chapter? This will delete all associated MCQs and cannot be undone.")) {
      return;
    }
    try {
      setLoading(true);
      const updatedChapters = selectedPaper.chapters.filter((chapter) => chapter.id !== chapterId);
      await updateDoc(doc(db, "pyqPapers", selectedPaper.id), {
        chapters: updatedChapters,
        updatedAt: serverTimestamp()
      });
      const mcqsQuery = query(
        collection(db, "prelimsMCQs"),
        where("paperId", "==", selectedPaper.id),
        where("chapterId", "==", chapterId)
      );
      const mcqsSnapshot = await getDocs(mcqsQuery);
      const deletePromises = mcqsSnapshot.docs.map((doc2) => deleteDoc(doc2.ref));
      await Promise.all(deletePromises);
      const updatedPaper = {
        ...selectedPaper,
        chapters: updatedChapters
      };
      setPapers((prev) => prev.map(
        (paper) => paper.id === selectedPaper.id ? updatedPaper : paper
      ));
      setSelectedPaper(updatedPaper);
      if ((selectedChapter == null ? void 0 : selectedChapter.id) === chapterId) {
        setSelectedChapter(null);
        resetForm();
      }
    } catch (err) {
      console.error("Error deleting chapter:", err);
      setError("Failed to delete chapter. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleMCQChange = (field, value) => {
    setCurrentMCQ((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleOptionChange = (index, value) => {
    const newOptions = [...currentMCQ.options];
    newOptions[index] = value;
    setCurrentMCQ((prev) => ({
      ...prev,
      options: newOptions
    }));
  };
  const addOption = () => {
    if (currentMCQ.options.length >= 6) {
      setError("Maximum of 6 options allowed");
      return;
    }
    setCurrentMCQ((prev) => ({
      ...prev,
      options: [...prev.options, ""]
    }));
  };
  const removeOption = (index) => {
    if (currentMCQ.options.length <= 2) {
      setError("Minimum of 2 options required");
      return;
    }
    const newOptions = [...currentMCQ.options];
    newOptions.splice(index, 1);
    let newCorrectOption = currentMCQ.correctOption;
    if (index === currentMCQ.correctOption) {
      newCorrectOption = 0;
    } else if (index < currentMCQ.correctOption) {
      newCorrectOption = currentMCQ.correctOption - 1;
    }
    setCurrentMCQ((prev) => ({
      ...prev,
      options: newOptions,
      correctOption: newCorrectOption
    }));
  };
  const handleSubmit = async () => {
    if (!selectedPaper || !selectedChapter) {
      return;
    }
    try {
      setLoading(true);
      const mcqData = {
        question: currentMCQ.question,
        options: currentMCQ.options,
        correctOption: currentMCQ.correctOption,
        explanation: currentMCQ.explanation,
        paperId: selectedPaper.id,
        paperTitle: selectedPaper.title,
        paperYear: selectedPaper.year,
        chapterId: selectedChapter.id,
        chapterTitle: selectedChapter.title,
        examType: selectedPaper.examType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      if (isEditing && editingId) {
        await updateDoc(doc(db, "prelimsMCQs", editingId), {
          ...mcqData,
          updatedAt: serverTimestamp()
        });
        setMcqs((prev) => prev.map(
          (mcq) => mcq.id === editingId ? { ...mcqData, id: editingId } : mcq
        ));
      } else {
        const docRef = await addDoc(collection(db, "prelimsMCQs"), mcqData);
        setMcqs((prev) => [...prev, { ...mcqData, id: docRef.id }]);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving MCQ:", err);
      setError("Failed to save MCQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (mcq) => {
    if (!mcq.id) return;
    setCurrentMCQ({
      question: mcq.question,
      options: mcq.options,
      correctOption: mcq.correctOption,
      explanation: mcq.explanation
    });
    setIsEditing(true);
    setEditingId(mcq.id);
  };
  const handleDelete = async (mcqId) => {
    if (!mcqId) return;
    if (!window.confirm("Are you sure you want to delete this MCQ?")) {
      return;
    }
    try {
      setLoading(true);
      await deleteDoc(doc(db, "prelimsMCQs", mcqId));
      setMcqs((prev) => prev.filter((mcq) => mcq.id !== mcqId));
    } catch (err) {
      console.error("Error deleting MCQ:", err);
      setError("Failed to delete MCQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleExamTypeChange = (examType) => {
    setSelectedExamType(examType);
    setSelectedPaper(null);
    setSelectedChapter(null);
    resetForm();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "sm:flex sm:items-center sm:justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Prelims MCQs Management" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      showError,
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Exam Type" }),
        /* @__PURE__ */ jsx("div", { className: "flex space-x-3", children: examTypes.map((type) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleExamTypeChange(type),
            className: `px-4 py-2 text-sm rounded-md ${selectedExamType === type ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`,
            children: type.toUpperCase()
          },
          type
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border rounded-md overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 px-4 py-3 border-b flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-gray-700", children: "Papers" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowPaperForm(!showPaperForm),
                className: "p-1 rounded-md text-blue-600 hover:bg-blue-50",
                title: "Add new paper",
                children: /* @__PURE__ */ jsx(FilePlus, { size: 16 })
              }
            )
          ] }),
          showPaperForm && /* @__PURE__ */ jsx("div", { className: "p-3 border-b bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Paper Title" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: newPaper.title,
                  onChange: (e) => setNewPaper((prev) => ({ ...prev, title: e.target.value })),
                  className: "w-full px-2 py-1 text-sm border border-gray-300 rounded-md",
                  placeholder: "e.g. UPSC 2023"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Year" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: newPaper.year,
                  onChange: (e) => setNewPaper((prev) => ({ ...prev, year: parseInt(e.target.value) })),
                  className: "w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleAddPaper,
                  className: "px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  disabled: loading,
                  children: "Add Paper"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowPaperForm(false),
                  className: "px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100",
                  children: "Cancel"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "h-96 overflow-y-auto p-2", children: loading && papers.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "animate-pulse p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-3/4 mb-3" }),
            /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-1/2 mb-3" }),
            /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-2/3 mb-3" })
          ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: papers.map((paper) => /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handlePaperSelect(paper),
                  className: `flex-1 text-left px-3 py-2 rounded-md flex items-center justify-between ${(selectedPaper == null ? void 0 : selectedPaper.id) === paper.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`,
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex-1 truncate", children: [
                      paper.title,
                      " (",
                      paper.year,
                      ")"
                    ] }),
                    expandedPapers[paper.id] ? /* @__PURE__ */ jsx(ChevronUp, { size: 16 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 16 })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDeletePaper(paper.id);
                  },
                  className: "p-1 rounded-md text-red-500 hover:bg-gray-100",
                  title: "Delete paper",
                  children: /* @__PURE__ */ jsx(Trash, { size: 14 })
                }
              )
            ] }),
            expandedPapers[paper.id] && /* @__PURE__ */ jsxs("div", { className: "ml-4 mt-1 space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2 py-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-500", children: "Chapters" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setShowChapterForm(!showChapterForm),
                    className: "p-1 rounded-md text-blue-600 hover:bg-blue-50",
                    title: "Add new chapter",
                    children: /* @__PURE__ */ jsx(FolderPlus, { size: 14 })
                  }
                )
              ] }),
              showChapterForm && (selectedPaper == null ? void 0 : selectedPaper.id) === paper.id && /* @__PURE__ */ jsx("div", { className: "p-2 mb-2 border rounded-md bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Chapter Title" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: newChapter.title,
                      onChange: (e) => setNewChapter((prev) => ({ ...prev, title: e.target.value })),
                      className: "w-full px-2 py-1 text-sm border border-gray-300 rounded-md",
                      placeholder: "e.g. Chapter 1"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Order" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: newChapter.order,
                      onChange: (e) => setNewChapter((prev) => ({ ...prev, order: parseInt(e.target.value) })),
                      className: "w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleAddChapter,
                      className: "px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700",
                      disabled: loading,
                      children: "Add Chapter"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowChapterForm(false),
                      className: "px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100",
                      children: "Cancel"
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-1", children: [
                paper.chapters.map((chapter) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleChapterSelect(chapter),
                      className: `flex-1 text-left px-3 py-2 rounded-md ${(selectedChapter == null ? void 0 : selectedChapter.id) === chapter.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`,
                      children: chapter.title
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleDeleteChapter(chapter.id);
                      },
                      className: "p-1 rounded-md text-red-500 hover:bg-gray-100",
                      title: "Delete chapter",
                      children: /* @__PURE__ */ jsx(Trash, { size: 14 })
                    }
                  )
                ] }) }, chapter.id)),
                paper.chapters.length === 0 && /* @__PURE__ */ jsx("li", { className: "text-xs text-gray-500 px-3 py-2", children: "No chapters yet. Add one to get started." })
              ] })
            ] })
          ] }, paper.id)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 border rounded-md overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-3 border-b", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-gray-700", children: isEditing ? "Edit MCQ" : "Add New MCQ" }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: selectedPaper && selectedChapter ? /* @__PURE__ */ jsx("form", { onSubmit: (e) => {
            e.preventDefault();
            handleSubmit();
          }, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Question" }),
              /* @__PURE__ */ jsx(
                ClientOnlyRichTextEditor,
                {
                  value: currentMCQ.question,
                  onChange: (value) => handleMCQChange("question", value),
                  placeholder: "Enter the question...",
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Options" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                currentMCQ.options.map((option, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      checked: currentMCQ.correctOption === index,
                      onChange: () => handleMCQChange("correctOption", index),
                      className: "mr-2"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: option,
                      onChange: (e) => handleOptionChange(index, e.target.value),
                      className: "flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                      placeholder: `Option ${index + 1}`,
                      required: true
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeOption(index),
                      className: "p-1 rounded-md text-red-500 hover:bg-gray-100",
                      title: "Remove option",
                      children: /* @__PURE__ */ jsx(Minus, { size: 16 })
                    }
                  )
                ] }, index)),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: addOption,
                    className: "mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-1" }),
                      " Add Option"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Select the radio button next to the correct option." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Explanation" }),
              /* @__PURE__ */ jsx(
                ClientOnlyRichTextEditor,
                {
                  value: currentMCQ.explanation,
                  onChange: (value) => handleMCQChange("explanation", value),
                  placeholder: "Enter the explanation...",
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  disabled: loading,
                  children: isEditing ? "Update MCQ" : "Add MCQ"
                }
              ),
              isEditing && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: resetForm,
                  className: "px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200",
                  children: "Cancel"
                }
              )
            ] })
          ] }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-10", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-10 w-10 mx-auto text-gray-400" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Select a paper and chapter to manage MCQs" })
          ] }) })
        ] })
      ] }),
      selectedPaper && selectedChapter && /* @__PURE__ */ jsxs("div", { className: "mt-6 border rounded-md overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-3 border-b", children: /* @__PURE__ */ jsxs("h2", { className: "text-sm font-medium text-gray-700", children: [
          "MCQs for ",
          selectedPaper.title,
          " - ",
          selectedChapter.title
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "p-4", children: mcqs.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: mcqs.map((mcq, index) => /* @__PURE__ */ jsxs("div", { className: "border rounded-md p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-md font-medium mb-2", children: [
              "Question ",
              index + 1
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleEdit(mcq),
                  className: "p-1 rounded-md text-gray-500 hover:bg-gray-100",
                  children: /* @__PURE__ */ jsx(Edit, { size: 16 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(mcq.id),
                  className: "p-1 rounded-md text-red-500 hover:bg-gray-100",
                  children: /* @__PURE__ */ jsx(Trash, { size: 16 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-3",
              dangerouslySetInnerHTML: { __html: mcq.question }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "space-y-1 mb-3", children: mcq.options.map((option, optIndex) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `p-2 rounded-md ${mcq.correctOption === optIndex ? "bg-green-50 border border-green-200" : "bg-gray-50"}`,
              children: [
                optIndex === mcq.correctOption && /* @__PURE__ */ jsx("span", { className: "text-green-600 font-medium", children: "✓ " }),
                option
              ]
            },
            optIndex
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 p-3 bg-blue-50 rounded-md", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-blue-800 mb-1", children: "Explanation:" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-sm text-blue-700",
                dangerouslySetInnerHTML: { __html: mcq.explanation }
              }
            )
          ] })
        ] }, mcq.id)) }) : /* @__PURE__ */ jsx("div", { className: "text-center py-10", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No MCQs found for this chapter. Add some using the form above." }) }) })
      ] })
    ] }) })
  ] });
};
const MainsPYQs = () => {
  const [showPaperForm, setShowPaperForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: "",
    year: (/* @__PURE__ */ new Date()).getFullYear(),
    examType: "upsc",
    paperType: "mains"
  });
  const [newChapter, setNewChapter] = useState({
    title: "",
    order: 1
  });
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPapers, setExpandedPapers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answer: "",
    tags: [],
    category: "general",
    paperId: "",
    paperTitle: "",
    paperYear: 0,
    chapterId: "",
    chapterTitle: "",
    examType: "upsc"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [examTypes] = useState(["upsc", "tgpsc", "appsc"]);
  const [selectedExamType, setSelectedExamType] = useState("upsc");
  const [newTag, setNewTag] = useState("");
  const showError = error ? /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-4", children: /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: error }) }) }) }) : null;
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "pyqPapers"),
          where("examType", "==", selectedExamType),
          where("paperType", "==", "mains")
        );
        const querySnapshot = await getDocs(q);
        const papersData = [];
        for (const docRef of querySnapshot.docs) {
          const data = docRef.data();
          papersData.push({
            id: docRef.id,
            title: data.title,
            year: data.year,
            examType: data.examType,
            paperType: data.paperType,
            chapters: data.chapters || []
          });
        }
        papersData.sort((a, b) => b.year - a.year);
        setPapers(papersData);
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError("Failed to load papers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [selectedExamType]);
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedPaper || !selectedChapter) {
        setQuestions([]);
        return;
      }
      try {
        setLoading(true);
        const q = query(
          collection(db, "mainsPYQs"),
          where("paperId", "==", selectedPaper.id),
          where("chapterId", "==", selectedChapter.id)
        );
        const querySnapshot = await getDocs(q);
        const questionsData = [];
        querySnapshot.forEach((doc2) => {
          const data = doc2.data();
          questionsData.push({
            id: doc2.id,
            question: data.question,
            answer: data.answer,
            tags: data.tags || [],
            category: data.category || "general",
            paperId: data.paperId,
            paperTitle: data.paperTitle,
            paperYear: data.paperYear,
            chapterId: data.chapterId,
            chapterTitle: data.chapterTitle,
            examType: data.examType
          });
        });
        setQuestions(questionsData);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [selectedPaper, selectedChapter]);
  const handlePaperSelect = async (paper) => {
    setExpandedPapers((prev) => ({
      ...prev,
      [paper.id]: !prev[paper.id]
    }));
    setSelectedPaper(paper);
    setSelectedChapter(null);
  };
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    resetForm();
  };
  const resetForm = () => {
    setCurrentQuestion({
      question: "",
      answer: "",
      tags: [],
      category: "general",
      paperId: "",
      paperTitle: "",
      paperYear: 0,
      chapterId: "",
      chapterTitle: "",
      examType: "upsc"
    });
    setIsEditing(false);
    setEditingId(null);
  };
  const handleAddPaper = async () => {
    if (!newPaper.title || newPaper.year <= 0) {
      setError("Please provide a valid paper title and year");
      return;
    }
    try {
      setLoading(true);
      const paperData = {
        title: newPaper.title,
        year: newPaper.year,
        examType: selectedExamType,
        paperType: "mains",
        chapters: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "pyqPapers"), paperData);
      const newPaperWithId = {
        id: docRef.id,
        ...paperData,
        chapters: []
      };
      setPapers((prev) => [...prev, newPaperWithId]);
      setNewPaper({
        title: "",
        year: (/* @__PURE__ */ new Date()).getFullYear(),
        examType: selectedExamType,
        paperType: "mains"
      });
      setShowPaperForm(false);
    } catch (err) {
      console.error("Error adding paper:", err);
      setError("Failed to add paper. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleAddChapter = async () => {
    if (!selectedPaper || !newChapter.title) {
      setError("Please select a paper and provide a chapter title");
      return;
    }
    try {
      setLoading(true);
      const chapterId = crypto.randomUUID();
      const newChapterObj = {
        id: chapterId,
        title: newChapter.title,
        order: newChapter.order
      };
      const updatedChapters = [...selectedPaper.chapters || [], newChapterObj];
      await updateDoc(doc(db, "pyqPapers", selectedPaper.id), {
        chapters: updatedChapters,
        updatedAt: serverTimestamp()
      });
      const updatedPaper = {
        ...selectedPaper,
        chapters: updatedChapters
      };
      setPapers((prev) => prev.map(
        (paper) => paper.id === selectedPaper.id ? updatedPaper : paper
      ));
      setSelectedPaper(updatedPaper);
      setNewChapter({
        title: "",
        order: updatedChapters.length + 1
      });
      setShowChapterForm(false);
    } catch (err) {
      console.error("Error adding chapter:", err);
      setError("Failed to add chapter. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePaper = async (paperId) => {
    if (!window.confirm("Are you sure you want to delete this paper? This will delete all associated questions and cannot be undone.")) {
      return;
    }
    try {
      setLoading(true);
      await deleteDoc(doc(db, "pyqPapers", paperId));
      const questionsQuery = query(
        collection(db, "mainsPYQs"),
        where("paperId", "==", paperId)
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      const deletePromises = questionsSnapshot.docs.map((doc2) => deleteDoc(doc2.ref));
      await Promise.all(deletePromises);
      setPapers((prev) => prev.filter((paper) => paper.id !== paperId));
      if ((selectedPaper == null ? void 0 : selectedPaper.id) === paperId) {
        setSelectedPaper(null);
        setSelectedChapter(null);
        resetForm();
      }
    } catch (err) {
      console.error("Error deleting paper:", err);
      setError("Failed to delete paper. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteChapter = async (chapterId) => {
    if (!selectedPaper) return;
    if (!window.confirm("Are you sure you want to delete this chapter? This will delete all associated questions and cannot be undone.")) {
      return;
    }
    try {
      setLoading(true);
      const updatedChapters = selectedPaper.chapters.filter((chapter) => chapter.id !== chapterId);
      await updateDoc(doc(db, "pyqPapers", selectedPaper.id), {
        chapters: updatedChapters,
        updatedAt: serverTimestamp()
      });
      const questionsQuery = query(
        collection(db, "mainsPYQs"),
        where("paperId", "==", selectedPaper.id),
        where("chapterId", "==", chapterId)
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      const deletePromises = questionsSnapshot.docs.map((doc2) => deleteDoc(doc2.ref));
      await Promise.all(deletePromises);
      const updatedPaper = {
        ...selectedPaper,
        chapters: updatedChapters
      };
      setPapers((prev) => prev.map(
        (paper) => paper.id === selectedPaper.id ? updatedPaper : paper
      ));
      setSelectedPaper(updatedPaper);
      if ((selectedChapter == null ? void 0 : selectedChapter.id) === chapterId) {
        setSelectedChapter(null);
        resetForm();
      }
    } catch (err) {
      console.error("Error deleting chapter:", err);
      setError("Failed to delete chapter. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleQuestionChange = (field, value) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!currentQuestion.tags.includes(newTag.trim())) {
      setCurrentQuestion((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
    }
    setNewTag("");
  };
  const handleRemoveTag = (tag) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag)
    }));
  };
  const handleSubmit = async () => {
    if (!selectedPaper || !selectedChapter) {
      return;
    }
    if (!currentQuestion.question.trim() || !currentQuestion.answer.trim()) {
      setError("Please provide both question and answer");
      return;
    }
    try {
      setLoading(true);
      const questionData = {
        question: currentQuestion.question,
        answer: currentQuestion.answer,
        tags: currentQuestion.tags,
        category: currentQuestion.category,
        paperId: selectedPaper.id,
        paperTitle: selectedPaper.title,
        paperYear: selectedPaper.year,
        chapterId: selectedChapter.id,
        chapterTitle: selectedChapter.title,
        examType: selectedPaper.examType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      if (isEditing && editingId) {
        await updateDoc(doc(db, "mainsPYQs", editingId), {
          ...questionData,
          updatedAt: serverTimestamp()
        });
        setQuestions((prev) => prev.map(
          (q) => q.id === editingId ? { ...questionData, id: editingId } : q
        ));
      } else {
        const docRef = await addDoc(collection(db, "mainsPYQs"), questionData);
        setQuestions((prev) => [...prev, { ...questionData, id: docRef.id }]);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving question:", err);
      setError("Failed to save question. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (question) => {
    if (!question.id) return;
    setCurrentQuestion({
      question: question.question,
      answer: question.answer,
      tags: question.tags || [],
      category: question.category || "general",
      paperId: question.paperId,
      paperTitle: question.paperTitle,
      paperYear: question.paperYear,
      chapterId: question.chapterId,
      chapterTitle: question.chapterTitle,
      examType: question.examType
    });
    setIsEditing(true);
    setEditingId(question.id);
  };
  const handleDelete = async (questionId) => {
    if (!questionId) return;
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }
    try {
      setLoading(true);
      await deleteDoc(doc(db, "mainsPYQs", questionId));
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleExamTypeChange = (examType) => {
    setSelectedExamType(examType);
    setSelectedPaper(null);
    setSelectedChapter(null);
    resetForm();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "sm:flex sm:items-center sm:justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Mains PYQs Management" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      showError,
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Exam Type" }),
        /* @__PURE__ */ jsx("div", { className: "flex space-x-3", children: examTypes.map((type) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleExamTypeChange(type),
            className: `px-4 py-2 text-sm rounded-md ${selectedExamType === type ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`,
            children: type.toUpperCase()
          },
          type
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border rounded-md overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 px-4 py-3 border-b flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-gray-700", children: "Papers" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowPaperForm(!showPaperForm),
                className: "p-1 rounded-md text-blue-600 hover:bg-blue-50",
                title: "Add new paper",
                children: /* @__PURE__ */ jsx(FilePlus, { size: 16 })
              }
            )
          ] }),
          showPaperForm && /* @__PURE__ */ jsx("div", { className: "p-3 border-b bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Paper Title" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: newPaper.title,
                  onChange: (e) => setNewPaper((prev) => ({ ...prev, title: e.target.value })),
                  className: "w-full px-2 py-1 text-sm border border-gray-300 rounded-md",
                  placeholder: "e.g. UPSC Mains 2023"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Year" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: newPaper.year,
                  onChange: (e) => setNewPaper((prev) => ({ ...prev, year: parseInt(e.target.value) })),
                  className: "w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleAddPaper,
                  className: "px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  disabled: loading,
                  children: "Add Paper"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowPaperForm(false),
                  className: "px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100",
                  children: "Cancel"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "h-96 overflow-y-auto p-2", children: loading && papers.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "animate-pulse p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-3/4 mb-3" }),
            /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-1/2 mb-3" }),
            /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-2/3 mb-3" })
          ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: papers.map((paper) => /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handlePaperSelect(paper),
                  className: `flex-1 text-left px-3 py-2 rounded-md flex items-center justify-between ${(selectedPaper == null ? void 0 : selectedPaper.id) === paper.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`,
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex-1 truncate", children: [
                      paper.title,
                      " (",
                      paper.year,
                      ")"
                    ] }),
                    expandedPapers[paper.id] ? /* @__PURE__ */ jsx(ChevronUp, { size: 16 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 16 })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDeletePaper(paper.id);
                  },
                  className: "p-1 rounded-md text-red-500 hover:bg-gray-100",
                  title: "Delete paper",
                  children: /* @__PURE__ */ jsx(Trash, { size: 14 })
                }
              )
            ] }),
            expandedPapers[paper.id] && /* @__PURE__ */ jsxs("div", { className: "ml-4 mt-1 space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2 py-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-500", children: "Chapters" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setShowChapterForm(!showChapterForm),
                    className: "p-1 rounded-md text-blue-600 hover:bg-blue-50",
                    title: "Add new chapter",
                    children: /* @__PURE__ */ jsx(FolderPlus, { size: 14 })
                  }
                )
              ] }),
              showChapterForm && (selectedPaper == null ? void 0 : selectedPaper.id) === paper.id && /* @__PURE__ */ jsx("div", { className: "p-2 mb-2 border rounded-md bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Chapter Title" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: newChapter.title,
                      onChange: (e) => setNewChapter((prev) => ({ ...prev, title: e.target.value })),
                      className: "w-full px-2 py-1 text-sm border border-gray-300 rounded-md",
                      placeholder: "e.g. Art & Culture"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Order" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: newChapter.order,
                      onChange: (e) => setNewChapter((prev) => ({ ...prev, order: parseInt(e.target.value) })),
                      className: "w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleAddChapter,
                      className: "px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700",
                      disabled: loading,
                      children: "Add Chapter"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowChapterForm(false),
                      className: "px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100",
                      children: "Cancel"
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-1", children: [
                paper.chapters.map((chapter) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleChapterSelect(chapter),
                      className: `flex-1 text-left px-3 py-2 rounded-md ${(selectedChapter == null ? void 0 : selectedChapter.id) === chapter.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`,
                      children: chapter.title
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleDeleteChapter(chapter.id);
                      },
                      className: "p-1 rounded-md text-red-500 hover:bg-gray-100",
                      title: "Delete chapter",
                      children: /* @__PURE__ */ jsx(Trash, { size: 14 })
                    }
                  )
                ] }) }, chapter.id)),
                paper.chapters.length === 0 && /* @__PURE__ */ jsx("li", { className: "text-xs text-gray-500 px-3 py-2", children: "No chapters yet. Add one to get started." })
              ] })
            ] })
          ] }, paper.id)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 border rounded-md overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-3 border-b", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-gray-700", children: isEditing ? "Edit Question" : "Add New Question" }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: selectedPaper && selectedChapter ? /* @__PURE__ */ jsx("form", { onSubmit: (e) => {
            e.preventDefault();
            handleSubmit();
          }, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Question" }),
              /* @__PURE__ */ jsx(
                ClientOnlyRichTextEditor,
                {
                  value: currentQuestion.question,
                  onChange: (value) => handleQuestionChange("question", value),
                  placeholder: "Enter the question...",
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Answer" }),
              /* @__PURE__ */ jsx(
                ClientOnlyRichTextEditor,
                {
                  value: currentQuestion.answer,
                  onChange: (value) => handleQuestionChange("answer", value),
                  placeholder: "Enter the answer...",
                  rows: 10
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Category" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: currentQuestion.category,
                  onChange: (e) => handleQuestionChange("category", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "general", children: "General" }),
                    /* @__PURE__ */ jsx("option", { value: "art_culture", children: "Art & Culture" }),
                    /* @__PURE__ */ jsx("option", { value: "history", children: "History" }),
                    /* @__PURE__ */ jsx("option", { value: "geography", children: "Geography" }),
                    /* @__PURE__ */ jsx("option", { value: "polity", children: "Polity" }),
                    /* @__PURE__ */ jsx("option", { value: "economy", children: "Economy" }),
                    /* @__PURE__ */ jsx("option", { value: "science", children: "Science & Technology" }),
                    /* @__PURE__ */ jsx("option", { value: "environment", children: "Environment & Ecology" }),
                    /* @__PURE__ */ jsx("option", { value: "international", children: "International Relations" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tags" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: currentQuestion.tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: [
                tag,
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleRemoveTag(tag),
                    className: "ml-1 text-blue-600 hover:text-blue-800",
                    children: "×"
                  }
                )
              ] }, tag)) }),
              /* @__PURE__ */ jsxs("div", { className: "flex", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: newTag,
                    onChange: (e) => setNewTag(e.target.value),
                    className: "flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    placeholder: "Add a tag",
                    onKeyPress: (e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleAddTag,
                    className: "px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700",
                    children: "Add"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  disabled: loading,
                  children: isEditing ? "Update Question" : "Add Question"
                }
              ),
              isEditing && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: resetForm,
                  className: "px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200",
                  children: "Cancel"
                }
              )
            ] })
          ] }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-10", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-10 w-10 mx-auto text-gray-400" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Select a paper and chapter to manage questions" })
          ] }) })
        ] })
      ] }),
      selectedPaper && selectedChapter && /* @__PURE__ */ jsxs("div", { className: "mt-6 border rounded-md overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-3 border-b", children: /* @__PURE__ */ jsxs("h2", { className: "text-sm font-medium text-gray-700", children: [
          "Questions for ",
          selectedPaper.title,
          " - ",
          selectedChapter.title
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "p-4", children: questions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: questions.map((question, index) => /* @__PURE__ */ jsxs("div", { className: "border rounded-md p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-md font-medium mb-2", children: [
              "Q.",
              index + 1
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleEdit(question),
                  className: "p-1 rounded-md text-gray-500 hover:bg-gray-100",
                  children: /* @__PURE__ */ jsx(Edit, { size: 16 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(question.id),
                  className: "p-1 rounded-md text-red-500 hover:bg-gray-100",
                  children: /* @__PURE__ */ jsx(Trash, { size: 16 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-3",
              dangerouslySetInnerHTML: { __html: question.question }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 p-3 bg-gray-50 rounded-md", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-gray-800 mb-1", children: "Answer:" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-sm text-gray-700 whitespace-pre-wrap",
                dangerouslySetInnerHTML: { __html: question.answer }
              }
            )
          ] }),
          question.tags && question.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-medium text-gray-600 mb-1", children: "Tags:" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: question.tags.map((tag) => /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800", children: tag }, tag)) })
          ] }),
          question.category && question.category !== "general" && /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 text-xs rounded-md bg-indigo-100 text-indigo-800", children: question.category.replace("_", " ") }) })
        ] }, question.id)) }) : /* @__PURE__ */ jsx("div", { className: "text-center py-10", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No questions found for this chapter. Add some using the form above." }) }) })
      ] })
    ] }) })
  ] });
};
const MainsPage = ({ examType: examTypeProp }) => {
  const { examType: examTypeParam = "upsc" } = useParams();
  const examType = examTypeProp || examTypeParam;
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [mainsQuestions, setMainsQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState({});
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "pyqPapers"),
          where("examType", "==", examType),
          where("paperType", "==", "mains")
        );
        const querySnapshot = await getDocs(q);
        const papersData = [];
        for (const doc2 of querySnapshot.docs) {
          const data = doc2.data();
          papersData.push({
            id: doc2.id,
            title: data.title,
            year: data.year,
            examType: data.examType,
            paperType: data.paperType,
            chapters: data.chapters || []
          });
        }
        papersData.sort((a, b) => b.year - a.year);
        setPapers(papersData);
        if (papersData.length > 0) {
          setSelectedPaper(papersData[0]);
        }
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError("Failed to load papers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [examType]);
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedPaper || !selectedChapter) return;
      try {
        setLoading(true);
        const q = query(
          collection(db, "mainsPYQs"),
          where("paperId", "==", selectedPaper.id),
          where("chapterId", "==", selectedChapter.id)
        );
        const querySnapshot = await getDocs(q);
        const questionsData = [];
        querySnapshot.forEach((doc2) => {
          questionsData.push({ id: doc2.id, ...doc2.data() });
        });
        setMainsQuestions(questionsData);
        setShowAnswer({});
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [selectedPaper, selectedChapter]);
  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
    setSelectedChapter(null);
    setMainsQuestions([]);
  };
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };
  const toggleAnswer = (questionId) => {
    if (!questionId) return;
    setShowAnswer((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-extrabold text-gray-900 sm:text-4xl", children: [
        examType.toUpperCase(),
        " Mains PYQs"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-3 max-w-2xl mx-auto text-xl text-gray-500", children: [
        "Practice with previous year questions for ",
        examType.toUpperCase(),
        " Mains"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12", children: [
      error && /* @__PURE__ */ jsx("div", { className: "rounded-md bg-red-50 p-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-red-400" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-red-800", children: "Error" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-red-700", children: error })
        ] })
      ] }) }),
      loading && !papers.length ? /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-8", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-1/3" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-40 bg-gray-200 rounded" }),
          /* @__PURE__ */ jsx("div", { className: "h-40 bg-gray-200 rounded md:col-span-3" })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "px-4 py-5 border-b border-gray-200 sm:px-6", children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: "Previous Year Papers" }) }),
          /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200 max-h-[400px] overflow-y-auto", children: papers.map((paper) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => handlePaperSelect(paper),
              className: `px-4 py-3 cursor-pointer hover:bg-gray-50 ${(selectedPaper == null ? void 0 : selectedPaper.id) === paper.id ? "bg-blue-50" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900", children: paper.title }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-gray-400" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: paper.year }),
                (selectedPaper == null ? void 0 : selectedPaper.id) === paper.id && paper.chapters && paper.chapters.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 pl-2 border-l-2 border-gray-200", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-medium text-gray-500 mb-1", children: "Chapters:" }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-1", children: paper.chapters.map((chapter) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleChapterSelect(chapter);
                      },
                      className: `px-2 py-1.5 text-xs rounded cursor-pointer hover:bg-gray-100 ${(selectedChapter == null ? void 0 : selectedChapter.id) === chapter.id ? "bg-blue-100" : ""}`,
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ jsx("span", { className: "font-medium", children: chapter.title }),
                          /* @__PURE__ */ jsx(BookOpen, { className: "h-3 w-3 text-gray-400" })
                        ] }),
                        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                          mainsQuestions.filter((q) => q.chapterId === chapter.id).length,
                          " questions"
                        ] })
                      ]
                    },
                    chapter.id
                  )) })
                ] })
              ]
            },
            paper.id
          )) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: selectedPaper && selectedChapter ? `${selectedPaper.title} - ${selectedChapter.title}` : "Select a Chapter" }),
            selectedChapter && mainsQuestions.length > 0 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800", children: [
              mainsQuestions.length,
              " questions"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-4 py-5 sm:p-6", children: selectedPaper && selectedChapter ? mainsQuestions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-8", children: mainsQuestions.map((question, index) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-4", children: [
              "Q.",
              index + 1
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-gray-700 mb-4",
                dangerouslySetInnerHTML: { __html: question.question }
              }
            ),
            question.category && question.category !== "general" && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800", children: question.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) }) }),
            !showAnswer[question.id || ""] ? /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => toggleAnswer(question.id),
                className: "mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                children: "Show Answer"
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "mt-6 bg-gray-50 p-4 rounded-md", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-md font-medium mb-2 flex items-center", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 mr-1 text-indigo-600" }),
                "Answer:"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none", children: /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line", children: question.answer }) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggleAnswer(question.id),
                  className: "mt-3 text-sm text-indigo-600 hover:text-indigo-500",
                  children: "Hide Answer"
                }
              )
            ] }),
            question.tags && question.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-1", children: question.tags.map((tag) => /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800", children: tag }, tag)) })
          ] }, question.id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "mx-auto h-12 w-12 text-gray-400" }),
            /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No questions available" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "There are no questions available for this chapter yet." })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "mx-auto h-12 w-12 text-gray-400" }),
            /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: selectedPaper ? "Select a chapter to begin" : "Select a paper to begin" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: selectedPaper ? "Choose a chapter from the list to view questions and answers." : "Select a previous year paper to view available chapters." })
          ] }) })
        ] }) })
      ] })
    ] })
  ] }) });
};
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [scheduleFile, setScheduleFile] = useState(null);
  const [scheduleName, setScheduleName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const formRef = React.useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: 0,
    duration: "",
    examType: "upsc",
    features: [""],
    paymentLink: "",
    scheduleUrl: ""
  });
  const fetchCourses = async () => {
    try {
      setLoading(true);
      if (!migrationCompleted) {
        try {
          await migrateCourseExamTypes();
          setMigrationCompleted(true);
          localStorage.setItem("coursesMigrationCompleted", "true");
        } catch (error) {
          console.warn("Migration failed, continuing with fetch:", error);
        }
      }
      const data = await getCourses();
      if (data.length === 0) {
        console.log("No courses found in Firestore, using sample data");
        setCourses(getSampleCourses());
        setUsingSampleData(true);
      } else {
        console.log(`Found ${data.length} courses`);
        setCourses(data);
        setUsingSampleData(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses(getSampleCourses());
      setUsingSampleData(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };
  useEffect(() => {
    const migrationDone = localStorage.getItem("coursesMigrationCompleted") === "true";
    setMigrationCompleted(migrationDone);
    fetchCourses();
    const handleBeforeUnload = (e) => {
      if (loading || uploading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };
  const handleOpenCreateModal = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      price: 0,
      duration: "",
      examType: "upsc",
      features: [""],
      paymentLink: "",
      scheduleUrl: ""
    });
    setImageFile(null);
    setImagePreview("");
    setScheduleFile(null);
    setScheduleName("");
    setEditingCourse(null);
    setShowCreateModal(true);
  };
  const isNumericId = (id) => {
    return /^\d+$/.test(id);
  };
  const handleOpenEditModal = (course) => {
    if (usingSampleData || isNumericId(course.id)) {
      alert(`Cannot edit sample course "${course.title}". This is demo data.

To edit courses:
1. Set up your Firebase configuration properly
2. Create new courses which will be saved to your database
3. Then you can edit your real courses`);
      return;
    }
    setFormData({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      price: course.price,
      duration: course.duration,
      examType: course.examType || "upsc",
      features: [...course.features],
      paymentLink: course.paymentLink || "",
      scheduleUrl: course.scheduleUrl || ""
    });
    setImageFile(null);
    setImagePreview(course.imageUrl);
    setScheduleFile(null);
    setScheduleName(course.scheduleUrl ? course.scheduleUrl.split("/").pop() || "Course Schedule" : "");
    setEditingCourse(course);
    setShowCreateModal(true);
  };
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadImage2 = async (file) => {
    try {
      setUploading(true);
      console.log("Uploading image:", file.name);
      const storageRef = ref(storage$1, `course-images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded image successfully");
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Image download URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  const uploadSchedulePDF = async (file) => {
    try {
      setUploading(true);
      console.log("Uploading schedule PDF:", file.name);
      const storageRef = ref(storage$1, `course-schedules/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded schedule PDF successfully");
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Schedule PDF download URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading schedule PDF:", error);
      throw error;
    }
  };
  const handleScheduleChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setScheduleFile(file);
      setScheduleName(file.name);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setFormData({ ...formData, price: value });
  };
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };
  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };
  const removeFeatureField = (index) => {
    if (formData.features.length <= 1) return;
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };
  const handleFormSubmission = async (formData2, isEditing) => {
    try {
      console.log("handleFormSubmission called with:", { formData: formData2, isEditing });
      const courseData = {
        title: formData2.title,
        description: formData2.description,
        imageUrl: formData2.imageUrl,
        price: formData2.price,
        duration: formData2.duration,
        examType: formData2.examType,
        features: formData2.features,
        paymentLink: formData2.paymentLink,
        scheduleUrl: formData2.scheduleUrl
      };
      console.log("Prepared courseData:", courseData);
      if (isEditing && editingCourse) {
        console.log("Updating existing course:", editingCourse.id);
        await updateCourse(editingCourse.id, courseData);
        console.log("Course updated successfully");
      } else {
        console.log("Creating new course...");
        const newCourse = await createCourse(courseData);
        console.log("Course created successfully:", newCourse);
      }
      console.log("Refreshing courses list...");
      await fetchCourses();
      console.log("Courses list refreshed");
      console.log(`Course ${isEditing ? "updated" : "created"} successfully`);
      return true;
    } catch (error) {
      console.error("Error in handleFormSubmission - Full details:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      console.error("Failed courseData:", {
        title: formData2.title,
        description: formData2.description,
        imageUrl: formData2.imageUrl,
        price: formData2.price,
        duration: formData2.duration,
        examType: formData2.examType,
        features: formData2.features,
        paymentLink: formData2.paymentLink,
        scheduleUrl: formData2.scheduleUrl
      });
      throw error;
    }
  };
  const validateForm = () => {
    var _a2, _b, _c;
    if (!((_a2 = formData.title) == null ? void 0 : _a2.trim())) {
      alert("Please enter a course title");
      return false;
    }
    if (!((_b = formData.description) == null ? void 0 : _b.trim())) {
      alert("Please enter a course description");
      return false;
    }
    if (!imageFile && !((_c = formData.imageUrl) == null ? void 0 : _c.trim())) {
      alert("Please upload an image or provide an image URL");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    var _a2;
    e.preventDefault();
    e.stopPropagation();
    console.log("Form submitted, preventing default");
    if (loading || uploading) {
      console.log("Already processing, ignoring submission");
      return;
    }
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      console.log("Processing course submission...");
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        try {
          console.log("Uploading new image file...");
          imageUrl = await uploadImage2(imageFile);
        } catch (error) {
          console.error("Failed to upload image:", error);
          alert(`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`);
          setLoading(false);
          return;
        }
      }
      let scheduleUrl = formData.scheduleUrl;
      if (scheduleFile) {
        try {
          console.log("Uploading new schedule PDF file...");
          scheduleUrl = await uploadSchedulePDF(scheduleFile);
        } catch (error) {
          console.error("Failed to upload schedule PDF:", error);
          alert(`Failed to upload schedule PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
          setLoading(false);
          return;
        }
      }
      if (!formData.title || !formData.description || !imageUrl && !formData.imageUrl) {
        console.warn("Validation failed - missing required fields");
        alert("Please fill in all required fields: Title, Description, and Image");
        setLoading(false);
        return;
      }
      const updatedFormData = {
        ...formData,
        imageUrl: imageUrl || formData.imageUrl,
        scheduleUrl: scheduleUrl || formData.scheduleUrl,
        examType: formData.examType || "upsc"
      };
      console.log("Prepared form data:", updatedFormData);
      const success = await handleFormSubmission(updatedFormData, !!editingCourse);
      if (success) {
        alert(editingCourse ? "Course updated successfully!" : "Course created successfully!");
        setShowCreateModal(false);
      } else {
        if (!editingCourse) {
          const newCourse = {
            ...updatedFormData,
            id: `temp-${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          setCourses([newCourse, ...courses]);
          alert("Course created in local state only. Database connection failed.");
          setShowCreateModal(false);
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting course - Full error details:", error);
      console.error("Error type:", typeof error);
      console.error("Error constructor:", (_a2 = error == null ? void 0 : error.constructor) == null ? void 0 : _a2.name);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        alert(`Detailed error: ${error.message}`);
      } else {
        console.error("Non-Error object thrown:", error);
        alert(`An error occurred while saving the course: ${JSON.stringify(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (usingSampleData || isNumericId(id)) {
      const course = courses.find((c) => c.id === id);
      alert(`Cannot delete sample course "${(course == null ? void 0 : course.title) || "Unknown"}". This is demo data.

To delete courses:
1. Set up your Firebase configuration properly
2. Create new courses which will be saved to your database
3. Then you can delete your real courses`);
      return;
    }
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }
    try {
      setDeletingCourseId(id);
      await deleteCourse(id);
      setCourses(courses.filter((course) => course.id !== id));
      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      setCourses(courses.filter((course) => course.id !== id));
      alert("Course removed from view, but database removal may have failed.");
    } finally {
      setDeletingCourseId(null);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    usingSampleData && /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border-l-4 border-amber-400 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-amber-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-amber-700", children: [
        /* @__PURE__ */ jsx("strong", { children: "Demo Mode:" }),
        " You're viewing sample courses because no real courses were found in your database. You cannot edit or delete these sample courses. Create new courses to start managing your real course data."
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "sm:flex sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Course Management" }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 sm:mt-0", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleOpenCreateModal,
          className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Create New Course"
          ]
        }
      ) })
    ] }),
    courses.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md p-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No courses available. Create your first course!" }) }) : /* @__PURE__ */ jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200", children: courses.map((course) => /* @__PURE__ */ jsx("li", { className: "px-4 py-4 sm:px-6 hover:bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-12 w-12 rounded overflow-hidden", children: /* @__PURE__ */ jsx(
          CourseImage,
          {
            imagePath: course.imageUrl,
            alt: course.title,
            className: "h-12 w-12 object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-blue-600", children: course.title }),
            (usingSampleData || isNumericId(course.id)) && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800", children: "Demo" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 line-clamp-1", children: course.description })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col mr-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-gray-900", children: formatPrice(course.price) }),
          course.scheduleUrl && /* @__PURE__ */ jsxs(
            "a",
            {
              href: course.scheduleUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-xs text-blue-600 hover:text-blue-800 flex items-center",
              children: [
                /* @__PURE__ */ jsx(FileText, { className: "h-3 w-3 mr-1" }),
                "Schedule"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleOpenEditModal(course),
            className: `p-2 ${usingSampleData || isNumericId(course.id) ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"}`,
            title: usingSampleData || isNumericId(course.id) ? "Cannot edit demo course" : "Edit course",
            disabled: deletingCourseId === course.id || usingSampleData || isNumericId(course.id),
            children: /* @__PURE__ */ jsx(Edit, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(course.id),
            className: `p-2 disabled:opacity-50 ${usingSampleData || isNumericId(course.id) ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-800"}`,
            title: usingSampleData || isNumericId(course.id) ? "Cannot delete demo course" : "Delete course",
            disabled: deletingCourseId === course.id || usingSampleData || isNumericId(course.id),
            children: deletingCourseId === course.id ? /* @__PURE__ */ jsx(Loader, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/courses",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "p-2 text-gray-600 hover:text-gray-800",
            title: "View courses page",
            children: /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }) }, course.id)) }) }),
    showCreateModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-b", children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: editingCourse ? "Edit Course" : "Create New Course" }) }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          ref: formRef,
          onSubmit: handleSubmit,
          className: "p-6 space-y-4",
          noValidate: true,
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: [
                "Course Title ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "title",
                  id: "title",
                  required: true,
                  className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                  value: formData.title,
                  onChange: handleInputChange
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: [
                "Description ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  name: "description",
                  id: "description",
                  rows: 3,
                  required: true,
                  className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                  value: formData.description,
                  onChange: handleInputChange
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700", children: [
                "Course Image ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center space-x-4", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-24 w-24 rounded-md overflow-hidden bg-gray-100 border border-gray-300", children: imagePreview ? /* @__PURE__ */ jsx(
                  CourseImage,
                  {
                    imagePath: imagePreview,
                    alt: "Course preview",
                    className: "h-24 w-24 object-cover"
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "h-24 w-24 flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8" }) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "relative border border-gray-300 rounded-md shadow-sm py-2 px-3 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500", children: /* @__PURE__ */ jsxs("label", { htmlFor: "imageUpload", className: "cursor-pointer flex items-center text-blue-600 hover:text-blue-500", children: [
                    /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5 mr-2" }),
                    /* @__PURE__ */ jsx("span", { children: uploading ? "Uploading..." : "Upload image" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        id: "imageUpload",
                        name: "imageUpload",
                        type: "file",
                        accept: "image/*",
                        className: "sr-only",
                        onChange: handleImageChange,
                        disabled: uploading
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "JPG, PNG or GIF, 800x600 recommended" }),
                  !imageFile && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                    /* @__PURE__ */ jsx("label", { htmlFor: "imageUrl", className: "block text-sm font-medium text-gray-700", children: "Or enter image URL:" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "url",
                        name: "imageUrl",
                        id: "imageUrl",
                        className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                        value: formData.imageUrl,
                        onChange: handleInputChange,
                        required: !imageFile
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "price", className: "block text-sm font-medium text-gray-700", children: "Price (₹)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    name: "price",
                    id: "price",
                    min: "0",
                    required: true,
                    className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                    value: formData.price,
                    onChange: handlePriceChange
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "duration", className: "block text-sm font-medium text-gray-700", children: 'Duration (e.g., "3 months")' }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "duration",
                    id: "duration",
                    required: true,
                    className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                    value: formData.duration,
                    onChange: handleInputChange
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "examType", className: "block text-sm font-medium text-gray-700", children: [
                "Exam Type ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  name: "examType",
                  id: "examType",
                  required: true,
                  className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                  value: formData.examType,
                  onChange: handleInputChange,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "upsc", children: "UPSC" }),
                    /* @__PURE__ */ jsx("option", { value: "tgpsc", children: "TGPSC" }),
                    /* @__PURE__ */ jsx("option", { value: "appsc", children: "APPSC" }),
                    /* @__PURE__ */ jsx("option", { value: "all", children: "All Exams" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Select the exam type this course is designed for" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "paymentLink", className: "block text-sm font-medium text-gray-700", children: "Payment Link" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex rounded-md shadow-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm", children: /* @__PURE__ */ jsx(Link$1, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    name: "paymentLink",
                    id: "paymentLink",
                    className: "flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                    placeholder: "https://payment.gateway.com/your-link",
                    value: formData.paymentLink,
                    onChange: handleInputChange
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Enter a payment gateway link where students can pay for this course" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Course Schedule PDF" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center space-x-4", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6 text-gray-400" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "relative border border-gray-300 rounded-md shadow-sm py-2 px-3 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500", children: /* @__PURE__ */ jsxs("label", { htmlFor: "scheduleUpload", className: "cursor-pointer flex items-center text-blue-600 hover:text-blue-500", children: [
                    /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5 mr-2" }),
                    /* @__PURE__ */ jsx("span", { children: uploading ? "Uploading..." : "Upload schedule PDF" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        id: "scheduleUpload",
                        name: "scheduleUpload",
                        type: "file",
                        accept: "application/pdf",
                        className: "sr-only",
                        onChange: handleScheduleChange,
                        disabled: uploading
                      }
                    )
                  ] }) }),
                  scheduleName && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center text-sm text-gray-600", children: [
                    /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 mr-1" }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: scheduleName })
                  ] }),
                  !scheduleFile && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                    /* @__PURE__ */ jsx("label", { htmlFor: "scheduleUrl", className: "block text-sm font-medium text-gray-700", children: "Or enter schedule PDF URL:" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "url",
                        name: "scheduleUrl",
                        id: "scheduleUrl",
                        className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                        value: formData.scheduleUrl,
                        onChange: handleInputChange,
                        placeholder: "https://example.com/course-schedule.pdf"
                      }
                    )
                  ] }),
                  formData.scheduleUrl && !scheduleFile && /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: formData.scheduleUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center text-sm text-blue-600 hover:text-blue-800",
                      children: [
                        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-1" }),
                        "View current schedule"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Upload a PDF file with the course schedule that students can download" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Features" }),
              formData.features.map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "flex mb-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: feature,
                    onChange: (e) => handleFeatureChange(index, e.target.value),
                    className: "flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                    placeholder: "Enter a feature",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeFeatureField(index),
                    className: "ml-2 p-2 text-red-600 hover:text-red-800",
                    title: "Remove feature",
                    disabled: formData.features.length <= 1,
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5" })
                  }
                )
              ] }, index)),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: addFeatureField,
                  className: "mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
                    "Add Feature"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 flex justify-end space-x-3 border-t", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowCreateModal(false),
                  className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  disabled: loading || uploading,
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center min-w-[120px]",
                  disabled: loading || uploading,
                  onClick: (e) => {
                    console.log("Submit button clicked");
                    if (loading || uploading) {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Already loading, preventing submission");
                      return;
                    }
                  },
                  children: loading || uploading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                      /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                      /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                    ] }),
                    uploading ? "Uploading..." : editingCourse ? "Updating..." : "Creating..."
                  ] }) : /* @__PURE__ */ jsx(Fragment, { children: editingCourse ? "Update Course" : "Create Course" })
                }
              )
            ] })
          ]
        }
      )
    ] }) })
  ] });
};
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {
    if (activeMessage) {
      setAdminComment(activeMessage.adminComment || "");
    }
  }, [activeMessage]);
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleMarkAsRead = async (id) => {
    try {
      await markMessageAsRead(id);
      setMessages(
        (prev) => prev.map(
          (message) => message.id === id ? { ...message, isRead: true } : message
        )
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };
  const handleToggleContacted = async (id, contacted) => {
    try {
      await updateContactedStatus(id, contacted);
      setMessages(
        (prev) => prev.map(
          (message) => message.id === id ? { ...message, contacted } : message
        )
      );
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage((prev) => prev ? { ...prev, contacted } : null);
      }
    } catch (err) {
      console.error("Error updating contacted status:", err);
    }
  };
  const handleSaveComment = async () => {
    if (!activeMessage) return;
    setIsSubmittingComment(true);
    try {
      await updateAdminComment(activeMessage.id, adminComment);
      setMessages(
        (prev) => prev.map(
          (message) => message.id === activeMessage.id ? { ...message, adminComment } : message
        )
      );
      setActiveMessage((prev) => prev ? { ...prev, adminComment } : null);
    } catch (err) {
      console.error("Error saving comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  const handleDelete = async (id) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((message) => message.id !== id));
      if ((activeMessage == null ? void 0 : activeMessage.id) === id) {
        setActiveMessage(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };
  const formatDate = (timestamp) => {
    return format(new Date(timestamp), "dd MMM yyyy, h:mm a");
  };
  if (loading) return /* @__PURE__ */ jsx(LoadingScreen, {});
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "sm:flex sm:items-center sm:justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Messages" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchMessages,
          className: "mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          children: "Refresh"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: error }) }),
    messages.length === 0 && !loading ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 bg-white rounded-lg shadow", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-1", children: "No Messages Yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "When users submit the contact form, their messages will appear here." })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 space-y-4", children: messages.map((message) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `
                  p-4 border rounded-lg cursor-pointer transition-colors
                  ${message.contacted ? "bg-green-50 border-green-200" : message.isRead ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200 font-medium"}
                  ${(activeMessage == null ? void 0 : activeMessage.id) === message.id ? "ring-2 ring-blue-500" : ""}
                `,
          onClick: () => {
            setActiveMessage(message);
            if (!message.isRead) {
              handleMarkAsRead(message.id);
            }
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-gray-900 font-medium truncate", children: message.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
                message.contacted && /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }),
                !message.isRead && /* @__PURE__ */ jsx("span", { className: "inline-block w-2 h-2 bg-blue-600 rounded-full" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-gray-500 mb-2", children: [
              /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 mr-1" }),
              /* @__PURE__ */ jsx("span", { children: message.phoneNumber })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm truncate mb-2", children: message.message }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: formatDate(message.createdAt) }),
              message.adminComment && /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4 text-gray-400" })
            ] })
          ]
        },
        message.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: activeMessage ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md border border-gray-200 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: activeMessage.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center mr-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: "contactedCheckbox",
                  checked: activeMessage.contacted,
                  onChange: (e) => handleToggleContacted(activeMessage.id, e.target.checked),
                  className: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "contactedCheckbox", className: "ml-2 text-sm text-gray-700", children: "Contacted" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(activeMessage.id),
                className: `p-1 rounded-full hover:bg-red-100 ${deleteConfirm === activeMessage.id ? "bg-red-100" : ""}`,
                title: "Delete message",
                children: deleteConfirm === activeMessage.id ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
                  /* @__PURE__ */ jsx(
                    Check,
                    {
                      className: "h-5 w-5 text-green-600 cursor-pointer",
                      onClick: () => handleDelete(activeMessage.id)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    X,
                    {
                      className: "h-5 w-5 text-red-600 cursor-pointer",
                      onClick: () => setDeleteConfirm(null)
                    }
                  )
                ] }) : /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5 text-red-500" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4 text-gray-500", children: [
          /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5 mr-2" }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `tel:${activeMessage.phoneNumber}`,
              className: "text-blue-600 hover:underline",
              children: activeMessage.phoneNumber
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-500 mb-2", children: "Message:" }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-lg text-gray-800", children: activeMessage.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-500 mb-2", children: "Admin Comment:" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: adminComment,
                onChange: (e) => setAdminComment(e.target.value),
                rows: 3,
                className: "w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2",
                placeholder: "Add your follow-up notes here..."
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleSaveComment,
                disabled: isSubmittingComment,
                className: "self-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
                children: isSubmittingComment ? "Saving..." : "Save Comment"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
          "Received on ",
          formatDate(activeMessage.createdAt)
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "bg-gray-50 rounded-lg border border-gray-200 p-6 flex items-center justify-center h-64", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Select a message to view details" }) }) })
    ] })
  ] });
};
const MarqueeItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    text: "",
    link: "",
    active: true,
    order: 0
  });
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getMarqueeItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching marquee items:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? e.target.checked : value
    });
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  const resetForm = () => {
    setFormData({
      text: "",
      link: "",
      active: true,
      order: items.length
      // Set order to the end of the list
    });
    setEditingItem(null);
    setFormOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMarqueeItem(editingItem.id, formData);
      } else {
        await addMarqueeItem({
          ...formData,
          order: items.length
          // Set order to the end of the list
        });
      }
      await fetchItems();
      resetForm();
    } catch (error) {
      console.error("Error saving marquee item:", error);
    }
  };
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      text: item.text,
      link: item.link || "",
      active: item.active,
      order: item.order
    });
    setFormOpen(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    try {
      await deleteMarqueeItem(id);
      await fetchItems();
    } catch (error) {
      console.error("Error deleting marquee item:", error);
    }
  };
  const handleMoveUp = async (item) => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex <= 0) return;
    const previousItem = items[currentIndex - 1];
    try {
      await updateMarqueeItem(item.id, { order: previousItem.order });
      await updateMarqueeItem(previousItem.id, { order: item.order });
      await fetchItems();
    } catch (error) {
      console.error("Error reordering items:", error);
    }
  };
  const handleMoveDown = async (item) => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex >= items.length - 1) return;
    const nextItem = items[currentIndex + 1];
    try {
      await updateMarqueeItem(item.id, { order: nextItem.order });
      await updateMarqueeItem(nextItem.id, { order: item.order });
      await fetchItems();
    } catch (error) {
      console.error("Error reordering items:", error);
    }
  };
  const handleToggleActive = async (item) => {
    try {
      await updateMarqueeItem(item.id, { active: !item.active });
      await fetchItems();
    } catch (error) {
      console.error("Error toggling item active state:", error);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "sm:flex sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Marquee Banner Items" }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 sm:mt-0", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setFormOpen(!formOpen),
          className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "w-4 h-4 mr-2" }),
            "Add New Item"
          ]
        }
      ) })
    ] }),
    formOpen && /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 shadow rounded-md", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium mb-4", children: editingItem ? "Edit Marquee Item" : "Add New Marquee Item" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "text", className: "block text-sm font-medium text-gray-700 mb-1", children: "Text*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "text",
              name: "text",
              value: formData.text,
              onChange: handleInputChange,
              required: true,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "link", className: "block text-sm font-medium text-gray-700 mb-1", children: "Link (Optional)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              id: "link",
              name: "link",
              value: formData.link,
              onChange: handleInputChange,
              placeholder: "https://example.com",
              className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Leave blank if you don't want the text to be clickable" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: "active",
              name: "active",
              checked: formData.active,
              onChange: handleCheckboxChange,
              className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "active", className: "ml-2 block text-sm text-gray-700", children: "Active (visible in marquee)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: resetForm,
              className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              children: editingItem ? "Update" : "Add"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-gray-500", children: "No marquee items found. Add some to display in the marquee banner." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200", children: items.map((item) => /* @__PURE__ */ jsx("li", { className: `px-4 py-4 sm:px-6 ${!item.active ? "bg-gray-50" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: `text-lg font-medium ${item.active ? "text-blue-600" : "text-gray-500"}`, children: item.text }),
        item.link && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-gray-500 truncate", children: [
          "Link: ",
          /* @__PURE__ */ jsx("a", { href: item.link, target: "_blank", rel: "noopener noreferrer", className: "text-blue-500 hover:underline", children: item.link })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleToggleActive(item),
            className: `p-1 rounded-full ${item.active ? "text-green-600 hover:text-green-800" : "text-gray-400 hover:text-gray-600"}`,
            title: item.active ? "Deactivate" : "Activate",
            children: item.active ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleMoveUp(item),
            className: "p-1 rounded-full text-gray-400 hover:text-gray-600",
            disabled: items.indexOf(item) === 0,
            title: "Move Up",
            children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleMoveDown(item),
            className: "p-1 rounded-full text-gray-400 hover:text-gray-600",
            disabled: items.indexOf(item) === items.length - 1,
            title: "Move Down",
            children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleEdit(item),
            className: "p-1 rounded-full text-blue-600 hover:text-blue-800",
            title: "Edit",
            children: /* @__PURE__ */ jsx(Edit2, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(item.id),
            className: "p-1 rounded-full text-red-600 hover:text-red-800",
            title: "Delete",
            children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" })
          }
        )
      ] })
    ] }) }, item.id)) }) })
  ] });
};
const TermsAndConditions = () => {
  useEffect(() => {
    window.location.href = "/terms-and-conditions.html";
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-screen", children: /* @__PURE__ */ jsx("p", { children: "Redirecting to Terms and Conditions..." }) });
};
const PrivacyPolicy = () => {
  useEffect(() => {
    window.location.href = "/privacy-policy.html";
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-screen", children: /* @__PURE__ */ jsx("p", { children: "Redirecting to Privacy Policy..." }) });
};
const RefundPolicy = () => {
  useEffect(() => {
    window.location.href = "/refund-policy.html";
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-screen", children: /* @__PURE__ */ jsx("p", { children: "Redirecting to Refund Policy..." }) });
};
const PaperSelectionPage = ({ initialData }) => {
  const { examType = "upsc" } = useParams();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) ;
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    const fetchPapers = async () => {
      var _a2;
      try {
        setLoading(true);
        const q = query(
          collection(db, "pyqPapers"),
          where("examType", "==", examType),
          where("paperType", "==", "prelims")
        );
        const querySnapshot = await getDocs(q);
        const papersData = [];
        for (const doc2 of querySnapshot.docs) {
          const data = doc2.data();
          papersData.push({
            id: doc2.id,
            title: data.title,
            year: data.year,
            examType: data.examType,
            paperType: data.paperType,
            chapters: data.chapters || [],
            createdAt: ((_a2 = data.createdAt) == null ? void 0 : _a2.toDate()) || /* @__PURE__ */ new Date()
          });
        }
        papersData.sort((a, b) => b.year - a.year);
        setPapers(papersData);
        setFilteredPapers(papersData);
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError("Failed to load papers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [examType, isClient]);
  useEffect(() => {
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let filtered = [...papers];
    switch (dateFilter) {
      case "today":
        filtered = papers.filter((paper) => {
          const paperDate = new Date(paper.createdAt);
          return paperDate >= today;
        });
        break;
      case "week":
        filtered = papers.filter((paper) => {
          const paperDate = new Date(paper.createdAt);
          return paperDate >= weekAgo;
        });
        break;
      case "month":
        filtered = papers.filter((paper) => {
          const paperDate = new Date(paper.createdAt);
          return paperDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = papers.filter((paper) => {
            const paperDate = new Date(paper.createdAt);
            return paperDate >= fromDateTime && paperDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = papers.filter((paper) => {
            const paperDate = new Date(paper.createdAt);
            return paperDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = papers.filter((paper) => {
            const paperDate = new Date(paper.createdAt);
            return paperDate <= toDateTime;
          });
        }
        break;
      default:
        filtered = papers;
    }
    setFilteredPapers(filtered);
  }, [dateFilter, papers, fromDate, toDate]);
  const handlePaperClick = (paper) => {
    navigate(`/pyqs/prelims/${examType}/paper/${paper.id}`);
  };
  const examTitle = examType === "upsc" ? "UPSC" : examType === "tgpsc" ? "TGPSC" : examType === "appsc" ? "APPSC" : "Prelims";
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-1/3" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsx("div", { className: "h-48 bg-white rounded-lg shadow" }, i)) })
    ] }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: error }) })
    ] }) }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: [
        examTitle,
        " Previous Year Papers"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Select a paper to view its questions and start practicing" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-medium text-gray-900 flex items-center", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5 mr-2 text-gray-500" }),
          "Filter by date:"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Papers"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "today" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "Today"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "week" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "This Week"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "month" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "This Month"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "custom" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "Custom Range"
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredPapers.map((paper) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handlePaperClick(paper),
        className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 text-blue-600" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-blue-600", children: paper.year })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: paper.title }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                "Chapters: ",
                paper.chapters.length
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                "Questions: ",
                paper.chapters.reduce((total, chapter) => {
                  var _a2;
                  return total + (((_a2 = chapter.questions) == null ? void 0 : _a2.length) || 0);
                }, 0)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-gray-50 border-t border-gray-100", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-blue-600 hover:text-blue-500", children: "Start Practice →" }) })
        ]
      },
      paper.id
    )) })
  ] }) });
};
const MainsPaperSelectionPage = ({ initialData }) => {
  const { examType = "upsc" } = useParams();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (initialData && initialData.quizzes) ;
  }, [initialData]);
  useEffect(() => {
    if (!isClient) return;
    const fetchPapers = async () => {
      var _a2;
      try {
        setLoading(true);
        const q = query(
          collection(db, "pyqPapers"),
          where("examType", "==", examType),
          where("paperType", "==", "mains")
        );
        const querySnapshot = await getDocs(q);
        const papersData = [];
        for (const doc2 of querySnapshot.docs) {
          const data = doc2.data();
          papersData.push({
            id: doc2.id,
            title: data.title,
            year: data.year,
            examType: data.examType,
            paperType: data.paperType,
            chapters: data.chapters || [],
            createdAt: ((_a2 = data.createdAt) == null ? void 0 : _a2.toDate()) || /* @__PURE__ */ new Date()
          });
        }
        papersData.sort((a, b) => b.year - a.year);
        setPapers(papersData);
        setFilteredPapers(papersData);
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError("Failed to load papers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [examType, isClient]);
  useEffect(() => {
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let filtered = [...papers];
    switch (dateFilter) {
      case "today":
        filtered = papers.filter((paper) => {
          const paperDate = new Date(paper.createdAt);
          return paperDate >= today;
        });
        break;
      case "week":
        filtered = papers.filter((paper) => {
          const paperDate = new Date(paper.createdAt);
          return paperDate >= weekAgo;
        });
        break;
      case "month":
        filtered = papers.filter((paper) => {
          const paperDate = new Date(paper.createdAt);
          return paperDate >= monthAgo;
        });
        break;
      case "custom":
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = papers.filter((paper) => {
            const paperDate = new Date(paper.createdAt);
            return paperDate >= fromDateTime && paperDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = papers.filter((paper) => {
            const paperDate = new Date(paper.createdAt);
            return paperDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = papers.filter((paper) => {
            const paperDate = new Date(paper.createdAt);
            return paperDate <= toDateTime;
          });
        }
        break;
      default:
        filtered = papers;
    }
    setFilteredPapers(filtered);
  }, [dateFilter, papers, fromDate, toDate]);
  const handlePaperClick = (paper) => {
    navigate(`/pyqs/mains/${examType}/paper/${paper.id}`);
  };
  const examTitle = examType === "upsc" ? "UPSC" : examType === "tgpsc" ? "TGPSC" : examType === "appsc" ? "APPSC" : "Mains";
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-1/3" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsx("div", { className: "h-48 bg-white rounded-lg shadow" }, i)) })
    ] }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: error }) })
    ] }) }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: [
        examTitle,
        " Mains Previous Year Papers"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Select a paper to view its questions and start practicing" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-medium text-gray-900 flex items-center", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5 mr-2 text-gray-500" }),
          "Filter by date:"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("all"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "All Papers"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("today"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "today" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "Today"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("week"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "week" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "This Week"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("month"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "month" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "This Month"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDateFilter("custom"),
              className: `px-4 py-2 rounded-full text-sm font-medium ${dateFilter === "custom" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "Custom Range"
            }
          )
        ] })
      ] }),
      dateFilter === "custom" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "from-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "from-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              max: toDate || void 0
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "to-date", className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "to-date",
              className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              min: fromDate || void 0
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredPapers.map((paper) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handlePaperClick(paper),
        className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 text-blue-600" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-blue-600", children: paper.year })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: paper.title }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                "Chapters: ",
                paper.chapters.length
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                "Questions: ",
                paper.chapters.reduce((total, chapter) => {
                  var _a2;
                  return total + (((_a2 = chapter.questions) == null ? void 0 : _a2.length) || 0);
                }, 0)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-gray-50 border-t border-gray-100", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-blue-600 hover:text-blue-500", children: "Start Practice →" }) })
        ]
      },
      paper.id
    )) })
  ] }) });
};
const App = ({ initialData }) => {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(MarqueeBanner, {}),
    /* @__PURE__ */ jsxs("div", { className: "pt-12", children: [
      /* @__PURE__ */ jsxs(Routes, { children: [
        /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Hero, {}),
          /* @__PURE__ */ jsx(Resources, {}),
          /* @__PURE__ */ jsx(About, {}),
          /* @__PURE__ */ jsx(Testimonials, {}),
          /* @__PURE__ */ jsx(FAQ, {}),
          /* @__PURE__ */ jsx(Contact, {})
        ] }) }),
        /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(Login$1, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/profile", element: /* @__PURE__ */ jsx(ProtectedRoute, { requireAdmin: false, children: /* @__PURE__ */ jsx(ProfilePage, {}) }) }),
        /* @__PURE__ */ jsx(Route, { path: "/quizzes", element: /* @__PURE__ */ jsx(QuizListPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/quiz/:quizId", element: /* @__PURE__ */ jsx(ProtectedRoute, { requireAdmin: false, children: /* @__PURE__ */ jsx(QuizPage, {}) }) }),
        /* @__PURE__ */ jsx(Route, { path: "/pyqs/prelims/:examType", element: /* @__PURE__ */ jsx(PaperSelectionPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/pyqs/prelims/:examType/paper/:paperId", element: /* @__PURE__ */ jsx(PrelimsPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/pyqs/mains/:examType", element: /* @__PURE__ */ jsx(MainsPaperSelectionPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/pyqs/mains/:examType/paper/:paperId", element: /* @__PURE__ */ jsx(MainsPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/prelims-practice", element: /* @__PURE__ */ jsx(PrelimsPracticePage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/mains-practice", element: /* @__PURE__ */ jsx(MainsPracticePage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/tgpsc-prelims-practice", element: /* @__PURE__ */ jsx(TGPSCPrelimsPracticePage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/tgpsc-mains-practice", element: /* @__PURE__ */ jsx(TGPSCMainsPracticePage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/appsc-prelims-practice", element: /* @__PURE__ */ jsx(APPSCPrelimsPracticePage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/appsc-mains-practice", element: /* @__PURE__ */ jsx(APPSCMainsPracticePage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/courses", element: /* @__PURE__ */ jsx(CoursesPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs", element: /* @__PURE__ */ jsx(CurrentAffairsPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/upsc", element: /* @__PURE__ */ jsx(UPSCCurrentAffairsPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/tgpsc", element: /* @__PURE__ */ jsx(TGPSCCurrentAffairsPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/appsc", element: /* @__PURE__ */ jsx(APPSCCurrentAffairsPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/upsc/:dateParam", element: /* @__PURE__ */ jsx(UPSCCurrentAffairsDetailPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/tgpsc/:dateParam", element: /* @__PURE__ */ jsx(TGPSCCurrentAffairsDetailPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/appsc/:dateParam", element: /* @__PURE__ */ jsx(APPSCCurrentAffairsDetailPage, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/upsc/:dateParam/:slug", element: /* @__PURE__ */ jsx(BlogPost, { isCurrentAffair: true, examType: "upsc", initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/tgpsc/:dateParam/:slug", element: /* @__PURE__ */ jsx(BlogPost, { isCurrentAffair: true, examType: "tgpsc", initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs/appsc/:dateParam/:slug", element: /* @__PURE__ */ jsx(BlogPost, { isCurrentAffair: true, examType: "appsc", initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/notes", element: /* @__PURE__ */ jsx(BlogIndex, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/notes/:slug", element: /* @__PURE__ */ jsx(BlogPost, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/category/:categorySlug", element: /* @__PURE__ */ jsx(CategoryPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/blogs", element: /* @__PURE__ */ jsx(BlogsIndex, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/blogs/:slug", element: /* @__PURE__ */ jsx(BlogPost, { isBlog: true, initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "/upsc-notes", element: /* @__PURE__ */ jsx(CustomPageView, { isExamPage: "upsc" }) }),
        /* @__PURE__ */ jsx(Route, { path: "/appsc-notes", element: /* @__PURE__ */ jsx(CustomPageView, { isExamPage: "appsc" }) }),
        /* @__PURE__ */ jsx(Route, { path: "/tgpsc-notes", element: /* @__PURE__ */ jsx(CustomPageView, { isExamPage: "tgpsc" }) }),
        /* @__PURE__ */ jsx(Route, { path: "/admin/login", element: /* @__PURE__ */ jsx(Login, {}) }),
        /* @__PURE__ */ jsxs(Route, { path: "/admin", element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(AdminLayout, {}) }), children: [
          /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Dashboard, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "posts", element: /* @__PURE__ */ jsx(BlogPosts, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "posts/new", element: /* @__PURE__ */ jsx(BlogPostEditor, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "posts/edit/:id", element: /* @__PURE__ */ jsx(BlogPostEditor, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "categories", element: /* @__PURE__ */ jsx(Categories, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "custom-pages", element: /* @__PURE__ */ jsx(CustomPages, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "banners", element: /* @__PURE__ */ jsx(Banners, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "courses", element: /* @__PURE__ */ jsx(Courses, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "quizzes", element: /* @__PURE__ */ jsx(Quizzes, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "quizzes/new", element: /* @__PURE__ */ jsx(QuizEditor, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "quizzes/edit/:id", element: /* @__PURE__ */ jsx(QuizEditor, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "quiz-attempts", element: /* @__PURE__ */ jsx(QuizAttempts, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "messages", element: /* @__PURE__ */ jsx(Messages, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "prelims-mcqs", element: /* @__PURE__ */ jsx(PrelimsMCQs, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "mains-pyqs", element: /* @__PURE__ */ jsx(MainsPYQs, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "marquee-items", element: /* @__PURE__ */ jsx(MarqueeItems, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "firebase-test", element: /* @__PURE__ */ jsx(FirebaseConnectionTest, {}) })
        ] }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs-debug", element: /* @__PURE__ */ jsx(CurrentAffairsDebug, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/current-affairs-raw", element: /* @__PURE__ */ jsx(CurrentAffairsRawData, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/editor-debug", element: /* @__PURE__ */ jsx(EditorDebugTest, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/firebase-test", element: /* @__PURE__ */ jsx(FirebaseConnectionTest, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/terms-and-conditions", element: /* @__PURE__ */ jsx(TermsAndConditions, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/privacy-policy", element: /* @__PURE__ */ jsx(PrivacyPolicy, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/refund-policy", element: /* @__PURE__ */ jsx(RefundPolicy, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/upsc-mains-pyqs", element: /* @__PURE__ */ jsx(Navigate, { to: "/pyqs/mains/upsc", replace: true }) }),
        /* @__PURE__ */ jsx(Route, { path: "/tgpsc-mains-pyqs", element: /* @__PURE__ */ jsx(Navigate, { to: "/pyqs/mains/tgpsc", replace: true }) }),
        /* @__PURE__ */ jsx(Route, { path: "/appsc-mains-pyqs", element: /* @__PURE__ */ jsx(Navigate, { to: "/pyqs/mains/appsc", replace: true }) }),
        /* @__PURE__ */ jsx(Route, { path: "/:slug", element: /* @__PURE__ */ jsx(CustomPageView, { initialData }) }),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] }) });
};
dotenv.config();
if (!getApps().length) {
  initializeApp$1({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) == null ? void 0 : _a.replace(/\\n/g, "\n")
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}
const adminDb = getFirestore$1();
const getBlogPostBySlugServer = async (slug) => {
  try {
    console.log("Server: Starting to fetch blog post with slug:", slug);
    const postsRef = adminDb.collection("posts");
    console.log("Server: Collection reference created");
    const q = postsRef.where("slug", "==", slug).where("published", "==", true);
    console.log("Server: Query created with slug:", slug, "and published: true");
    const snapshot = await q.get();
    console.log("Server: Query executed, snapshot size:", snapshot.size);
    console.log("Server: Snapshot empty:", snapshot.empty);
    if (snapshot.empty) {
      console.log("Server: No posts found with slug:", slug);
      return null;
    }
    const doc2 = snapshot.docs[0];
    const postData = { id: doc2.id, ...doc2.data() };
    console.log("Server: Post found with ID:", doc2.id);
    console.log("Server: Post title:", postData.title);
    console.log("Server: Post published status:", postData.published);
    return postData;
  } catch (error) {
    console.error("Server: Error fetching blog post:", error);
    console.error("Server: Error details:", error.message);
    if (error.code) {
      console.error("Server: Firebase error code:", error.code);
    }
    return null;
  }
};
const getCategoriesServer = async () => {
  try {
    const categoriesRef = adminDb.collection("categories");
    const snapshot = await categoriesRef.get();
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    console.error("Server-side error fetching categories:", error);
    return [];
  }
};
const getPublishedPostsServer = async () => {
  try {
    const postsRef = adminDb.collection("posts");
    const q = postsRef.where("published", "==", true).orderBy("createdAt", "desc");
    const snapshot = await q.get();
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    console.error("Server-side error fetching published posts:", error);
    return [];
  }
};
const getCurrentAffairsPostsServer = async () => {
  try {
    const postsRef = adminDb.collection("posts");
    const q = postsRef.where("published", "==", true).where("isCurrentAffair", "==", true);
    const snapshot = await q.get();
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    console.error("Server-side error fetching current affairs:", error);
    return [];
  }
};
const getCustomPageBySlugServer = async (slug) => {
  try {
    console.log("Server: Starting to fetch custom page with slug:", slug);
    const pagesRef = adminDb.collection("custom_pages");
    console.log("Server: Collection reference created");
    const q = pagesRef.where("slug", "==", slug).where("published", "==", true);
    console.log("Server: Query created with slug:", slug, "and published: true");
    const snapshot = await q.get();
    console.log("Server: Query executed, snapshot size:", snapshot.size);
    if (snapshot.empty) {
      console.log("Server: No pages found with slug:", slug);
      return null;
    }
    const doc2 = snapshot.docs[0];
    const pageData = { id: doc2.id, ...doc2.data() };
    console.log("Server: Page found with ID:", doc2.id);
    console.log("Server: Page title:", pageData.title);
    return pageData;
  } catch (error) {
    console.error("Server: Error fetching custom page:", error);
    return null;
  }
};
const getCoursesServer = async () => {
  try {
    console.log("Server: Fetching courses from Firestore...");
    const coursesRef = adminDb.collection("courses");
    const q = coursesRef.orderBy("createdAt", "desc");
    const snapshot = await q.get();
    console.log(`Server: Fetched ${snapshot.docs.length} courses`);
    return snapshot.docs.map((doc2) => {
      const data = doc2.data();
      return {
        id: doc2.id,
        ...data,
        examType: data.examType || "upsc"
      };
    });
  } catch (error) {
    console.error("Server-side error fetching courses:", error);
    return [];
  }
};
const getQuizzesServer = async () => {
  try {
    console.log("Server: Fetching quizzes from Firestore...");
    const quizQuery = adminDb.collection("quizzes").orderBy("createdAt", "desc");
    const querySnapshot = await quizQuery.get();
    console.log(`Server: Fetched ${querySnapshot.docs.length} quizzes`);
    return querySnapshot.docs.map((doc2) => {
      const data = doc2.data();
      return {
        id: doc2.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    });
  } catch (error) {
    console.error("Server-side error getting quizzes:", error);
    return [];
  }
};
const getQuizByIdServer = async (id) => {
  try {
    const docRef = adminDb.collection("quizzes").doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    }
    return null;
  } catch (error) {
    console.error(`Server-side error getting quiz with ID ${id}:`, error);
    return null;
  }
};
const getCurrentAffairsByDateServer = async (dateParam, examType) => {
  try {
    console.log("Server: Fetching current affairs for date:", dateParam, "exam type:", examType);
    const postsRef = adminDb.collection("posts");
    const q = postsRef.where("published", "==", true).where("isCurrentAffair", "==", true).where("examType", "==", examType).where("dateParam", "==", dateParam).orderBy("createdAt", "desc");
    const snapshot = await q.get();
    console.log(`Server: Found ${snapshot.docs.length} current affairs posts`);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    console.error("Server-side error fetching current affairs by date:", error);
    return [];
  }
};
const getCurrentAffairsBySlugServer = async (dateParam, slug, examType) => {
  try {
    console.log("Server: Fetching current affairs post with slug:", slug, "date:", dateParam, "exam type:", examType);
    const postsRef = adminDb.collection("posts");
    const q = postsRef.where("published", "==", true).where("isCurrentAffair", "==", true).where("examType", "==", examType).where("dateParam", "==", dateParam).where("slug", "==", slug);
    const snapshot = await q.get();
    if (snapshot.empty) {
      console.log("Server: No current affairs post found");
      return null;
    }
    const doc2 = snapshot.docs[0];
    const postData = { id: doc2.id, ...doc2.data() };
    console.log("Server: Current affairs post found with ID:", doc2.id);
    return postData;
  } catch (error) {
    console.error("Server-side error fetching current affairs post:", error);
    return null;
  }
};
const getCurrentAffairsDatesServer = async (examType) => {
  try {
    console.log("Server: Fetching current affairs dates for exam type:", examType);
    const postsRef = adminDb.collection("posts");
    const q = postsRef.where("published", "==", true).where("isCurrentAffair", "==", true).where("examType", "==", examType);
    const snapshot = await q.get();
    const dates = [...new Set(snapshot.docs.map((doc2) => doc2.data().dateParam))];
    console.log(`Server: Found ${dates.length} unique dates`);
    return dates.sort().reverse();
  } catch (error) {
    console.error("Server-side error fetching current affairs dates:", error);
    return [];
  }
};
async function render(url) {
  try {
    console.log("SSR: Starting render for URL:", url);
    let initialData = null;
    if (url.startsWith("/blogs/")) {
      const slug = url.split("/blogs/")[1];
      console.log("SSR: Processing blog route with slug:", slug);
      try {
        const post = await getBlogPostBySlugServer(slug);
        const categories = await getCategoriesServer();
        const allPosts = await getPublishedPostsServer();
        const currentAffairs = await getCurrentAffairsPostsServer();
        if (post) {
          initialData = {
            post,
            categories,
            allPosts,
            currentAffairs,
            slug,
            pageType: "blog"
          };
        }
      } catch (error) {
        console.error("SSR: Error fetching blog data:", error);
      }
    } else if (url.startsWith("/notes/")) {
      const slug = url.split("/notes/")[1];
      console.log("SSR: Processing notes route with slug:", slug);
      try {
        const post = await getBlogPostBySlugServer(slug);
        const categories = await getCategoriesServer();
        const allPosts = await getPublishedPostsServer();
        if (post) {
          initialData = {
            post,
            categories,
            allPosts,
            slug,
            pageType: "notes"
          };
        }
      } catch (error) {
        console.error("SSR: Error fetching notes data:", error);
      }
    } else if (url.startsWith("/current-affairs")) {
      if (url === "/current-affairs") {
        console.log("SSR: Processing current affairs main page");
        try {
          const upscDates = await getCurrentAffairsDatesServer("upsc");
          const tgpscDates = await getCurrentAffairsDatesServer("tgpsc");
          const appscDates = await getCurrentAffairsDatesServer("appsc");
          initialData = {
            upscDates,
            tgpscDates,
            appscDates,
            pageType: "currentAffairsMain"
          };
        } catch (error) {
          console.error("SSR: Error fetching current affairs main data:", error);
        }
      } else {
        const pathParts = url.split("/current-affairs/")[1].split("/");
        const examType = pathParts[0];
        if (pathParts.length === 2) {
          const dateParam = pathParts[1];
          console.log("SSR: Processing current affairs date route:", examType, dateParam);
          try {
            const posts = await getCurrentAffairsByDateServer(dateParam, examType);
            const dates = await getCurrentAffairsDatesServer(examType);
            initialData = {
              posts,
              dates,
              examType,
              dateParam,
              pageType: "currentAffairsDate"
            };
          } catch (error) {
            console.error("SSR: Error fetching current affairs date data:", error);
          }
        } else if (pathParts.length === 3) {
          const dateParam = pathParts[1];
          const slug = pathParts[2];
          console.log("SSR: Processing current affairs post route:", examType, dateParam, slug);
          try {
            const post = await getCurrentAffairsBySlugServer(dateParam, slug, examType);
            const dates = await getCurrentAffairsDatesServer(examType);
            if (post) {
              initialData = {
                post,
                dates,
                examType,
                dateParam,
                slug,
                pageType: "currentAffairsPost"
              };
            }
          } catch (error) {
            console.error("SSR: Error fetching current affairs post data:", error);
          }
        }
      }
    } else if (url === "/courses") {
      console.log("SSR: Processing courses page");
      try {
        const courses = await getCoursesServer();
        initialData = {
          courses,
          pageType: "courses"
        };
      } catch (error) {
        console.error("SSR: Error fetching courses data:", error);
      }
    } else if (url === "/quizzes") {
      console.log("SSR: Processing quizzes page");
      try {
        const quizzes = await getQuizzesServer();
        initialData = {
          quizzes,
          pageType: "quizzes"
        };
      } catch (error) {
        console.error("SSR: Error fetching quizzes data:", error);
      }
    } else if (url.startsWith("/quiz/")) {
      const quizId = url.split("/quiz/")[1];
      console.log("SSR: Processing quiz page with ID:", quizId);
      try {
        const quiz = await getQuizByIdServer(quizId);
        if (quiz) {
          initialData = {
            quiz,
            pageType: "quiz"
          };
        }
      } catch (error) {
        console.error("SSR: Error fetching quiz data:", error);
      }
    } else if (url.startsWith("/pyqs/")) {
      console.log("SSR: Processing PYQs page");
      try {
        const quizzes = await getQuizzesServer();
        initialData = {
          quizzes,
          pageType: "pyqs"
        };
      } catch (error) {
        console.error("SSR: Error fetching PYQs data:", error);
      }
    } else if (url.match(/^\/(upsc|tgpsc|appsc)-notes$/)) {
      const examType = url.split("-")[0];
      console.log("SSR: Processing exam notes page for:", examType);
      try {
        const page = await getCustomPageBySlugServer(`${examType}-notes`);
        if (page) {
          initialData = {
            page,
            examType,
            pageType: "examNotes"
          };
        }
      } catch (error) {
        console.error("SSR: Error fetching exam notes data:", error);
      }
    } else if (url !== "/" && !url.startsWith("/admin") && !url.startsWith("/login") && !url.startsWith("/profile")) {
      const slug = url.substring(1);
      console.log("SSR: Processing root-level route with slug:", slug);
      try {
        const post = await getBlogPostBySlugServer(slug);
        if (post) {
          console.log("SSR: Found post with slug:", slug);
          const categories = await getCategoriesServer();
          const allPosts = await getPublishedPostsServer();
          initialData = {
            post,
            categories,
            allPosts,
            slug,
            pageType: "post"
          };
        } else {
          console.log("SSR: No post found, checking for custom page");
          const page = await getCustomPageBySlugServer(slug);
          if (page) {
            initialData = {
              page,
              slug,
              pageType: "customPage"
            };
          }
        }
      } catch (error) {
        console.error("SSR: Error fetching data for root-level route:", error);
      }
    } else if (url === "/") {
      console.log("SSR: Processing homepage");
      try {
        const categories = await getCategoriesServer();
        const recentPosts = await getPublishedPostsServer();
        const courses = await getCoursesServer();
        initialData = {
          categories,
          recentPosts: recentPosts.slice(0, 6),
          // Limit to 6 recent posts
          courses: courses.slice(0, 6),
          // Limit to 6 recent courses
          pageType: "homepage"
        };
      } catch (error) {
        console.error("SSR: Error fetching homepage data:", error);
      }
    }
    console.log("SSR: Initial data prepared:", initialData ? Object.keys(initialData) : "none");
    const html = renderToString(
      /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, { initialData }) }) })
    );
    return { html, initialData };
  } catch (error) {
    console.error("SSR: Render failed:", error);
    return {
      html: `
        <div id="root">
          <h1>Loading...</h1>
          <p>Please wait while the page loads.</p>
        </div>
      `,
      initialData: null
    };
  }
}
export {
  render
};
