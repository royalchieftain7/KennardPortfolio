import React, { useState, useEffect } from 'react'
import workScribble from "../../assets/images/custom/work-scribble.svg"
import { getSupabaseErrorMessage, supabase } from '../../supabaseClient'
import ImageSlider from '../ui/imageSlider';
import { Link } from 'react-router-dom';

const Portfolio = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!supabase) {
                    throw new Error(getSupabaseErrorMessage());
                }
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('order', { ascending: true });
                if (error) {
                    setError(getSupabaseErrorMessage(error));
                } else {
                    setProjects(data ?? []);
                }
            } catch (err) {
                setError(getSupabaseErrorMessage(err));
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);

    const openSlider = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeSlider = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div className="projects-area" id="portfolio">
                <div className="custom-icon">
                    <img src={workScribble} alt="custom" />
                </div>
                <div className="container-fluid">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div style={{ color: 'red' }}>Error: {error}</div>
                    ) : (
                        <div className="row g-4 portfolio-grid">
                            {projects.map((project, index) => {
                              // Robustly extract the first image from image_url (array, stringified array, or string)
                              let firstImage = "";
                              if (Array.isArray(project.image_url)) {
                                firstImage = project.image_url.find(
                                  url => typeof url === "string" && url.trim() && url !== "[]" && url !== '""'
                                );
                              } else if (typeof project.image_url === "string" && project.image_url.trim() && project.image_url !== "[]" && project.image_url !== '""') {
                                try {
                                  const parsed = JSON.parse(project.image_url);
                                  if (Array.isArray(parsed)) {
                                    firstImage = parsed.find(
                                      url => typeof url === "string" && url.trim() && url !== "[]" && url !== '""'
                                    );
                                  } else {
                                    firstImage = project.image_url.replace(/^\[|\]$/g, "").replace(/^"(.*)"$/, "$1");
                                  }
                                } catch {
                                  firstImage = project.image_url.replace(/^\[|\]$/g, "").replace(/^"(.*)"$/, "$1");
                                }
                              }
                          
                              return (
                                <div
                                  key={project.id}
                                  className={`${project.size === "large" ? "col-md-6 col-xl-6" : "col-md-6 col-xl-4"} portfolio-item category-${project.id}`}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                    justifyContent: "flex-start"
                                  }}
                                >
                                  <div className="work-popup" style={{ height: "100%" }}>
                                    <div
                                      onClick={e => {
                                        if (project.website && project.website.trim()) {
                                          let url = project.website.trim();
                                          if (!/^https?:\/\//i.test(url)) {
                                            url = "https://" + url;
                                          }
                                          window.open(url, "_blank", "noopener,noreferrer");
                                        } else {
                                          openSlider(index);
                                        }
                                      }}
                                      className="portfolio-box"
                                      style={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "flex-start"
                                      }}
                                    >
                                      {firstImage &&
                                        (firstImage.toLowerCase().endsWith(".mp4") ? (
                                          <video
                                            src={firstImage.replace(/^\[|\]$/g, "").replace(/^"(.*)"$/, "$1")}
                                            controls={false}
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              borderRadius: "8px",
                                              marginBottom: "0.75rem",
                                              objectFit: "cover",
                                              minHeight: 0,
                                              pointerEvents: "none"
                                            }}
                                            tabIndex={-1}
                                            preload="metadata"
                                            muted
                                            playsInline
                                            onLoadedMetadata={e => {
                                              try {
                                                if (e.target.duration > 15) {
                                                  e.target.currentTime = 15;
                                                }
                                                // Pause at 15s and show the frame
                                                e.target.pause();
                                              } catch {}
                                            }}
                                          />
                                        ) : (
                                          <img
                                            src={firstImage.replace(/^\[|\]$/g, "").replace(/^"(.*)"$/, "$1")}
                                            alt=""
                                            data-rjs="2"
                                            style={{
                                              width: "100%",
                                              borderRadius: "8px",
                                              marginBottom: "0.75rem",
                                              objectFit: "cover",
                                              flex: 1,
                                              minHeight: 0,
                                            }}
                                          />
                                        ))}
                                      <span className="portfolio-category">{project.category}</span>
                                      <h1 className="portfolio-caption">
                                        <Link to={"/single-project"}>{project.title}</Link>
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <ImageSlider
              images={
                (() => {
                  const item = projects[currentIndex];
                  if (!item) return [];
                  let urls = [];
                  if (Array.isArray(item.image_url)) {
                    urls = item.image_url.filter(
                      url => typeof url === "string" && url.trim() && url !== "[]" && url !== '""'
                    );
                  } else if (typeof item.image_url === "string" && item.image_url.trim() && item.image_url !== "[]" && item.image_url !== '""') {
                    try {
                      const parsed = JSON.parse(item.image_url);
                      if (Array.isArray(parsed)) {
                        urls = parsed.filter(
                          url => typeof url === "string" && url.trim() && url !== "[]" && url !== '""'
                        );
                      } else {
                        urls = [item.image_url];
                      }
                    } catch {
                      urls = [item.image_url];
                    }
                  }
                  return urls.map((url, idx) => ({
                    src: url.replace(/^\[|\]$/g, "").replace(/^"(.*)"$/, "$1"),
                    alt: item.title + " " + (idx + 1)
                  }));
                })()
              }
              isOpen={isOpen}
              onClose={closeSlider}
              currentIndex={0}
            />
        </>
    )
}

export default Portfolio

