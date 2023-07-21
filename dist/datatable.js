/*!
  * DataTable v1.0.3 (https://getbootstrap.com/)
  * Copyright 2023, Author (https://github.com/jahiidh)
  * Licensed under MIT (https://github.com/jahiidh/datatable/LICENSE)
  */
class DataTable {
    constructor(s, p = {}) {
        let _ = this;
        _.s = s;
        _.d = p.data ?? false;
        _.c = p.content ?? false;
        _.col = p.columns ?? false;
        _.hx = p.hideExtra ?? false;
        _.stk = p.sticky ?? false;
        _.cat = p.categories ?? false;
        _.srt = p.sort ?? false;
        _.srtc = p.sort_columns ?? false;
        _.srch = p.search ?? false;
        _.pgn = p.pagination ?? false;
        _.pgnb = p.pagination_buttons ?? false;
        _.lmt = p.limit ?? false;
        _.cds = p.catDesign ?? false;
        _.clmt = p.current_limit ?? false;
        _.tc = p.themeClass ?? "initial";
        _.so = p.search_on ?? false;
        _.sh = p.search_heighlight ?? false;
        _.th = {};
        _.h();
    }

    mn = (h) => {
        // make node
        var range = document.createRange().createContextualFragment(h);
        let node = range.firstChild;
        while (node != null && node.nodeType == 3) {
            node = node.nextSibling;
        }
        return node;
    };
    pg(p, s, c) {
        // pages_in_total, show_pagination_buttons_at_a_time, current_page
        if (c <= p && p > 1) {
            let m = Math.floor(s / 2);
            if (s > p) {
                s = p;
            }
            let st = 1;
            if (c - m > 0) {
                st = c - m;
            }
            let e,
                r = [];
            if (st + s > p && p - s + 1 > 1) {
                st = p - s + 1;
                e = st + s;
            } else {
                e = st + s;
            }
            for (st; st < e; st++) {
                if (st <= p) {
                    r.push(st);
                }
            }

            if (r[0] > 1) {
                r = [(c - 1), "s", ...r];
            } else {
                r = [(c - 1), ...r];
            }
            if (r[r.length - 1] < p) {
                r = [...r, "e", (parseInt(c) + 1)];
            } else {
                r = [...r, (parseInt(c) + 1)];
            }
            return r;
        }
    }
    qa(s, c, $ = document) {
        // dom selector
        $.querySelectorAll(s).forEach((n, i) => {
            return c(n, i);
        });
    }
    clck = (c) => {
        window.addEventListener("click", (e) => {
            let _ = this;
            _.qa(".dt-body", (n, i) => {
                _.qa(
                    c,
                    (cn, ci) => {
                        if (e.target == cn || cn.contains(e.target)) {
                            return cn;
                        }
                    },
                    n
                );
            });
        });
    };
    fev() {
        let dom = document,
            _ = this;
        window.addEventListener("click", (e) => {
            _.qa(".dt-body .dt-sortable", (n, i) => {
                if (e.target == n || n.contains(e.target)) {
                    _.qa(
                        ".dt-sortable",
                        (cn, ci) => {
                            if (n == cn) {
                                if (cn.classList.contains("sorted")) {
                                    cn.classList.remove("sorted");
                                    _.dtsrt(cn.closest(".dt-body"), ci, "asc");
                                } else {
                                    cn.classList.add("sorted");
                                    _.dtsrt(cn.closest(".dt-body"), ci, "desc");
                                }
                            } else {
                                cn.classList.remove("sorted");
                            }
                        },
                        n.closest("tr")
                    );
                }
            });
            _.qa(".dt-body .dt-pagination-btn", (n, i) => {
                if (e.target == n || n.contains(e.target)) {
                    if (n.hasAttribute("data")) {
                        let pn = n.closest(".dt-body"),
                            d = pn.querySelectorAll("tbody tr"),
                            cp = n.getAttribute("data");

                        if (pn.querySelector('.dt-limit')) {
                            _.clmt = pn.querySelector('.dt-limit').value;
                        } else {
                            _.clmt = pn.querySelectorAll('tbody tr').length;
                        }
                        let ph = _.pgmk(d.length, cp);
                        _.clmt = pn.querySelector('.dt-limit').value;
                        pn.querySelector(".dt-pagination").outerHTML = ph;
                        let trs = pn.querySelector('.dt-table tbody');
                        _.qa('tr', (cn, z) => {
                            if (((cp - 1) * _.clmt) <= z && z < (cp * _.clmt)) {
                                cn.classList.remove('d-none');
                            } else {
                                cn.classList.add('d-none');
                            }
                        }, trs);
                        pn.querySelector('.dt-info-start').innerText = (d.length == 0) ? 0 : (cp - 1) * _.clmt + 1;
                        pn.querySelector('.dt-info-end').innerText = (d.length < (cp * _.clmt)) ? d.length : (cp * _.clmt);
                        pn.querySelector('.dt-info-total').innerText = d.length;
                    }
                }
            });

            _.qa(".dt-body .dt-catbutton", (n, i) => {
                if (e.target == n || n.contains(e.target)) {
                    let v = n.getAttribute('value');
                    n = n.closest('.dt-category');
                    _.qa('.dt-catbutton', (cn, z) => {
                        if (cn.getAttribute('value') === v) {
                            cn.classList.add('active');
                        } else {
                            cn.classList.remove('active');
                        }
                    });
                    let tb = _.dtcs(n.getAttribute('data-column'), n.getAttribute('data-name'), v, n.closest('.dt-body'));
                    n.closest('.dt-body').querySelector('tbody').replaceWith(tb);
                }
            })
        });

        window.addEventListener('input', (e) => {
            _.qa(".dt-body .dt-category", (n, i) => {
                if (e.target == n || n.contains(e.target)) {
                    let tb = _.dtcs(n.getAttribute('data-column'), n.name, n.value, n.closest('.dt-body'));
                    n.closest('.dt-body').querySelector('tbody').replaceWith(tb);
                }
            })
            _.qa(".dt-body .dt-search input", (n, i) => {
                if (e.target == n || n.contains(e.target)) {
                    let tb = _.dtcs('search', 'dt-default-search', n.value, n.closest('.dt-body'));
                    n.closest('.dt-body').querySelector('tbody').replaceWith(tb);
                    // console.log(tb);
                }
            })
            _.qa(".dt-body .dt-limit", (n, i) => {
                if (e.target == n || n.contains(e.target)) {
                    _.dtlmt(n.closest('.dt-body'));
                }
            })
        });
    }

    dtlmt = (n) => {
        let _ = this, v = n.querySelector('.dt-limit').value,
            tb = document.createElement('tbody'), sd = false, c = 0, tc = 0;
        _.qa('tbody tr', (cn, x) => {
            if (!cn.classList.contains('d-none')) {
                sd = true;
            }
            if (sd && c++ < v) {
                cn.classList.remove('d-none');
            } else {
                cn.classList.add('d-none');
            }
            if (!cn.hasAttribute('hidetype')) {
                tc++;
            }
            tb.append(cn);
        }, n);
        _.clmt = v;
        _.pgmk(tc, 1, n);
        // n.querySelector('.dt-info-end').innerText = (parseInt(n.querySelector('.dt-info-start').innerText) + tc - 1);
        n.querySelector('tbody').replaceWith(tb);
    }
    eva = (d) => {
        if (Array.isArray(d)) {
            return d.flatMap(i => this.eva(i));
        } else if (typeof d === 'object' && d !== null) {
            return Object.values(d).flatMap(v => this.eva(v));
        } else {
            return [d];
        }
    }
    dtcs = (c, cid, t, n) => {
        let _ = this, ci, cl, a = false, m = c.match(/\{column\[(\d+)\](.*)\}/);
        if (m) {
            ci = (parseInt(m[1]) + 1);
            if (m[2] !== '' && m[2].match(/ attr\[(.*)\]/)) {
                let m2 = m[2].match(/ attr\[(.*)\]/);
                cl = m[2].replaceAll(m2[0], '');
                a = m2[1].replaceAll(/^['"]|['"]$/g, '');
            } else {
                cl = m[2];
            }
        }

        let tb = document.createElement('tbody'),
            x = 0, d,
            cp = 1;

        if (n.querySelector('.dt-limit')) {
            _.clmt = n.querySelector('.dt-limit').value;
        } else {
            _.clmt = n.querySelectorAll('tbody tr').length;
        }
        _.qa('tbody tr', (cn, z) => {

            let rt = false, hta = [];

            if (cid === 'dt-default-search') {
                _.qa('td', (tdv, zc) => {
                    // console.log(tdv.innerText);
                    let so = _.so, soa = [];
                    if (!so || (Array.isArray(so) && so.length === 0) || (typeof so === 'object' && Object.keys(so).length === 0)) {
                        so = 'column';
                    }
                    if (so) {
                        let av;
                        if (typeof so == 'string') {
                            soa.push(so);
                        } else if (so.constructor == Array) {
                            if (so.length === 1) {
                                av = so;
                            } else if (so[zc]) {
                                av = _.eva(so[zc]);
                            }
                            soa = [...soa, ...av];
                        } else if (typeof so == 'object') {
                            if (so['*']) {
                                av = _.eva(so['*']);
                            }
                            if (so[zc]) {
                                av = _.eva(so[zc]);
                            }
                            soa = [...soa, ...av];
                        }
                        if (t !== '') {
                            if ((soa.includes('strict') && soa.includes('column')) || !(soa.includes('strict'))) {
                                if (tdv.innerText.toLowerCase().match(t)) {
                                    if (_.sh) {
                                        tdv.classList.add('dt-search-highlight');
                                    }
                                    rt = true;
                                } else {
                                    tdv.classList.remove('dt-search-highlight');
                                }
                            }
                            soa.forEach((v, x) => {
                                if (!v.includes(['strict', 'column'])) {
                                    let atv = '';
                                    if (tdv.hasAttribute(v)) {
                                        if (tdv.getAttribute(v).match(t)) {
                                            if (_.sh) {
                                                tdv.classList.add('dt-search-highlight');
                                            }
                                            rt = true;
                                        } else {
                                            tdv.classList.remove('dt-search-highlight');
                                        }
                                    }
                                    _.qa('[' + v + ']', (chel, cheli) => {
                                        if (chel.hasAttribute(v)) {
                                            if (chel.getAttribute(v).match(t)) {
                                                if (_.sh) {
                                                    chel.classList.add('dt-search-highlight');
                                                }
                                                rt = true;
                                            } else {
                                                chel.classList.remove('dt-search-highlight');
                                            }
                                        }
                                    }, tdv);
                                }
                            });
                        } else {
                            rt = true;
                            tdv.classList.remove('dt-search-highlight');
                        }
                    }
                }, cn);
            } else {
                let ctd = cn.querySelector('td:nth-child(' + ci + ')' + cl), ctdt;
                if (!ctd) {
                    ctdt = '';
                } else if (a) {
                    if (ctd.getAttribute(a)) {
                        ctdt = ctd.getAttribute(a).toLowerCase();
                    } else if (ctd.querySelector("[" + a + "]")) {
                        ctdt = ctd.querySelector("[" + a + "]").getAttribute(a).toLowerCase();
                    }
                } else {
                    ctdt = ctd.innerText.toLowerCase();
                }
                if (ctdt === t.toLowerCase() || t === '') {
                    rt = true;
                } else {
                    rt = false;
                }
            }




            if (cn.hasAttribute('hidetype')) {
                let cns = cn.getAttribute('hidetype').split(',');
                cns = cns.map(elm => elm.trim());
                hta = cns;
            }
            if (rt) {
                if (hta.includes(cid)) {
                    hta.splice(parseInt(hta.indexOf(cid)), 1);
                }
            } else if (!hta.includes(cid)) {
                hta.push(cid);
            }
            if (hta.length > 0) {
                cn.setAttribute('hidetype', hta.join(", "));
            } else {
                cn.removeAttribute('hidetype');
                x++;
            }
            if (_.clmt >= x) {
                cn.classList.remove("d-none");
            } else {
                cn.classList.add("d-none");
            }
            tb.appendChild(cn);
        }, n);
        if ((tb.querySelectorAll('.dt-norow').length !== 0) || x === 0) {
            if (tb.querySelectorAll('.dt-norow').length == 0) {
                let et = document.createElement('tr');
                et.innerHTML = '<td colspan="100">No Result found.</td>';
                et.classList.add('dt-norow');
                tb.appendChild(et);
            } else {
                tb.querySelector('.dt-norow').classList.remove('d-none');
                tb.querySelector('.dt-norow').removeAttribute('hidetype');
            }
        } else {
            tb.querySelector('.dt-norow')?.remove();
        }
        _.pgmk(x, cp, n);

        return tb;
    }

    pgmk = (d, cp, n) => {

        let _ = this;
        if (d.length) {
            d = d.length;
        }
        let pgnb = (_.pgnb !== false) ? _.pgnb : 5;

        let tpg = Math.ceil(d / (_.clmt ?? d));
        let pgn = _.pg(tpg, pgnb, cp);
        let ph = `<div class="dt-pagination">`;
        if (pgn) {
            let pgn_f = pgn[0],
                pgn_l = pgn[pgn.length - 1];

            pgn.splice(-1);
            pgn.splice(0, 1);
            ph += `<button class="dt-pagination-btn" ${pgn_f > 0 ? 'data="' + pgn_f + '"' : "disabled"
                } >Prev</button>`;
            pgn.forEach((v) => {
                if (v == "s") {
                    ph += `<button class="dt-pagination-btn" data="1">1</button>`;
                } else if (v == "e") {
                    ph += `<button class="dt-pagination-btn" data="${tpg}">${tpg}</button>`;
                } else {
                    ph += `<button class="dt-pagination-btn ${v == cp ? "active" : ""
                        }" data="${v}">${v}</button>`;
                }
            });
            ph += `<button class="dt-pagination-btn" ${pgn_l - 1 < tpg ? 'data="' + pgn_l + '"' : "disabled"
                } >Next</button>`;
        } else {
            ph += `<button class="dt-pagination-btn" disabled>Prev</button>`;
            ph += `<button class="dt-pagination-btn active" data="1">1</button>`;
            ph += `<button class="dt-pagination-btn" disabled>Next</button>`;
        }
        ph += `</div>`;
        if (n && n.querySelector(".dt-pagination")) {
            n.querySelector(".dt-pagination").outerHTML = ph;
            n.querySelector('.dt-info-total').innerText = d;
            n.querySelector('.dt-info-start').innerText = (d == 0) ? 0 : (cp - 1) * _.clmt + 1;
            n.querySelector('.dt-info-end').innerText = (d < (cp * _.clmt)) ? d : (cp * _.clmt);
        }
        return ph;
    };

    dtsrt = (n, c, d) => {
        let _ = this;
        _.clmt = n.querySelector(".dt-limit").value;
        let tbody = n.querySelector(".dt-table tbody");
        let rs = Array.from(tbody.rows);
        let sortOrder = d == "asc" ? 1 : -1;
        rs.sort((a, b) => {
            let textA = a.cells[c].textContent.trim();
            let textB = b.cells[c].textContent.trim();
            return sortOrder * textA.localeCompare(textB);
        });

        var tb = document.createElement("tbody");
        let x = 0;
        for (let r of rs) {
            if (_.clmt > x) {
                r.classList.remove("d-none");
            } else {
                r.classList.add("d-none");
            }
            tb.appendChild(r);
            if (!r.hasAttribute('hidetype')) {
                x++;
            }
        }
        _.pgmk(x, 1, n);
        tbody.replaceWith(tb);
    };

    catm = (r, d) => {
        let z = r.placeholder.toLowerCase().replaceAll(" ", ""),
            oz = z,
            cz = 1,
            _ = this,
            cl = [],
            cat;
        if (!_.tempcatnames) {
            _.tempcatnames = [];
        }
        while (_.tempcatnames.includes(z)) {
            z = oz + cz++;
        }
        _.tempcatnames.push(z);

        if (r.type && r.type == 'button') {
            cat = `<div data-name="${z}" data-column="${r.column}" class="dt-category"><button class="dt-catbutton active" value="">All</button>`;
            let cv = r.data;
            const m = [...cv.matchAll(/{data\[(\d+)\]\.value}/g)];
            m.forEach((mr) => {
                d.forEach((er, ri) => {
                    er[mr[1]].split(",").forEach((v) => {
                        if (!cl.includes(v)) {
                            cat += `<button class="dt-catbutton" value="${v}">${v}</button>`;
                            cl.push(v);
                        }
                    });
                });
            });
            cat += `</div>`;
        } else {
            cat = `<select name="${z}" data-column="${r.column}" class="dt-category"><option value="">${r.placeholder}</option>`;
            let cv = r.data;
            const m = [...cv.matchAll(/{data\[(\d+)\]\.value}/g)];
            m.forEach((mr) => {
                d.forEach((er, ri) => {
                    er[mr[1]].split(",").forEach((v) => {
                        if (!cl.includes(v)) {
                            cat += `<option value="${v}">${v}</option>`;
                            cl.push(v);
                        }
                    });
                });
            });
            cat += `</select>`;
        }

        // this.n.setAttribute("data-" + z, r.column);
        return cat;
    };
    svgs = {
        arrow: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" class="caret-down-alt"><path d="M98,190.06,237.78,353.18a24,24,0,0,0,36.44,0L414,190.06c13.34-15.57,2.28-39.62-18.22-39.62H116.18C95.68,150.44,84.62,174.49,98,190.06Z"></path></svg>`,
    };
    gfc(t, ni) {
        // generate further content
        let $ = document,
            _ = this,
            s = this.s,
            h = "",
            d;
        let n = _.mn(t);
        if ((_.d && _.c == false) || (_.d && _.c && _.c == "data")) {
            d = _.d;
        } else if (_.tempd) {
            d = _.tempd;
        } else {
            console.error("Code are changed. Plaese restore the library again.");
            return;
        }
        _.qa(
            "tbody tr",
            (cn, ci) => {
                if (_.clmt && ci + 1 > _.clmt) {
                    cn.classList.add("d-none");
                }
                _.qa(
                    "td",
                    (td, tdi) => {
                        let gh = _.th[tdi];
                        if (gh !== "" && gh !== undefined) {
                            gh = gh.replaceAll("{data.value}", td.innerHTML);
                            const m = [...gh.matchAll(/{data\[(\d+)\]\.value}/g)];
                            m.forEach((mr) => {
                                gh = gh.replaceAll(mr[0], d[ci][mr[1]]);
                            });
                            td.innerHTML = gh;
                        }
                    },
                    cn
                );
            },
            n
        );
        n.classList.add("dt-table", _.tc);
        if (_.stk) {
            n.classList.add("dt-sticky");
        }
        _.n = n;
        let df = "",
            sc = "",
            ph = "",
            dti = "",
            render = "";

        if (_.lmt) {
            df += `<select class="dt-limit" name="dt_limit" >`;
            if (_.lmt.constructor == Array) {
                _.lmt.forEach((v) => {
                    df += `<option value="${v}" ${v == _.clmt ? "selected" : ""
                        }>${v}</option>`;
                });
            } else if (typeof _.lmt == "object") {
                for (let i in _.lmt) {
                    if (i == "active" && _.clmt === false) {
                        df += `<option value="${_.lmt[i]}" selcted>${_.lmt[i]}</option>`;
                        _.clmt = _.lmt[i];
                    } else {
                        df += `<option value="${_.lmt[i]}" ${_.lmt[i] == _.clmt ? "selcted" : ""
                            }>${_.lmt[i]}</option>`;
                    }
                }
            }
            df += `</select>`;
        }
        if (_.cat) {
            if (typeof _.cat == "array" || _.cat.constructor == Array) {
                _.cat.forEach((r, i) => {
                    df += _.catm(r, d);
                });
            } else if (typeof _.cat == "object") {
                df += _.catm(_.cat, d);
            }
        }
        if (_.srch) {
            sc += `<div class="dt-search"><input type="text" placeholder="Search" /></div>`;
        }

        if (_.srt) {
            _.qa(
                "thead th",
                (nh, i) => {
                    if (_.srtc && _.srtc.constructor == Array) {
                        if (_.srtc.includes(i)) {
                            _.n.querySelectorAll("thead th")[
                                i
                            ].innerHTML = `<span class="dt-sortable">${nh.innerHTML}<span>${_.svgs.arrow}</span></span>`;
                        }
                    } else {
                        _.n.querySelectorAll("thead th")[
                            i
                        ].innerHTML = `<span class="dt-sortable">${nh.innerHTML}<span>${_.svgs.arrow}</span></span>`;
                    }
                },
                _.n
            );
        }

        if (_.pgn) {
            ph = _.pgmk(d, 1);
        }
        dti += `<div class="dt-info">Showing <span class="dt-info-start">1</span> to <span class="dt-info-end">`;
        if (_.clmt) {
            if (_.clmt > d.length) {
                dti += d.length;
            } else {
                dti += _.clmt;
            }
            dti += `</span> of <span class="dt-info-total">`;
        } else {
            dti += `${d.length}</span> of <span class="dt-info-total">`;
        }
        dti += `${d.length}</span> entries</div>`;

        let eld = "";

        var div = $.createElement("div");
        if ((_.d && _.c && _.c == "data") || (_.d && _.c === false)) {
            for (const attr of $.querySelectorAll(s)[ni].attributes) {
                div.setAttribute(attr.name, attr.value);
            }
        }

        div.classList.add("dt-body");

        div.innerHTML = `
        <div class="dt-header">
          <div class="d-flex">
            <div class="dt-filter">
              ${df}
            </div>
            ${sc}
          </div>
        </div>
        ${_.n.outerHTML}
        <div class="dt-footer">
          <div class="d-flex">
            ${dti}
            ${ph}
          </div>
        </div>
    `;

        $.querySelectorAll(s)[ni].replaceWith(div);
    }
    gt() {
        let $ = document,
            _ = this,
            s = this.s,
            t = "",
            col = _.col;
        if ((_.d && _.c === false) || (_.c && _.c == "data" && _.d)) {
            t += `<table><thead><tr>`;
            if (col == false) {
                col = _.d[0];
            }

            if (col && (typeof col == "array" || col.constructor == Array)) {
                col.forEach((r, i) => {
                    if (typeof r == "object") {
                        if (r.title) {
                            t += `<th>${r.title}</th>`;
                        } else {
                            t += `<th>${i + 1}</th>`;
                        }
                        if (r.html) {
                            this.th[i] = r.html;
                        } else {
                            this.th[i] = '';
                        }
                    } else if (["string", "number"].includes(typeof r)) {
                        if (r == "") {
                            r = "Col " + (i + 1);
                        }
                        t += `<th>${r}</th>`;
                        this.th[i] = "";
                    } else if (typeof r == "array") {
                        if (r[0]) {
                            t += `<th>${r[0]}</th>`;
                        }
                        if (r[1]) {
                            this.th[i] = r.html;
                        } else {
                            this.th[i] = "";
                        }
                    } else {
                        console.log(typeof r);
                        console.error(
                            "Columns type mismatch. Read the documentation again."
                        );
                    }
                });
            } else if (col && typeof col == "object") {
                for (let i in col) {
                    if (["string", "number"].includes(typeof col[i])) {
                        t += `<th>${col[i]}</th>`;
                        _.th[i] = "";
                    } else if (typeof col[i] == "array") {
                        if (col[i][1]) {
                            t += `<th>${col[i][0]}</th>`;
                            _.th[i] = col[i][1];
                        } else if (col[i][0]) {
                            t += `<th>${col[i][0]}</th>`;
                            _.th[i] = "";
                        } else {
                            t += `<th>Col ${i + 1}</th>`;
                            _.th[i] = "";
                        }
                    } else if (typeof col[i] == "object") {
                        if (col[i].title) {
                            t += `<th>${col[i].title}</th>`;
                        } else {
                            t += `<th>Col ${i + 1}</th>`;
                        }
                        if (col[i].html) {
                            _.th[i] = col[i].html;
                        } else {
                            _.th[i] = "";
                        }
                    } else {
                        console.error(
                            "columns item must be object and key name must be html"
                        );
                    }
                }
            }
            t += `</tr></thead><tbody>`;
            _.d.forEach((r, i) => {
                if (typeof r == "string" || ["string", "number"].includes(typeof r)) {
                    r = [r];
                } else if (typeof r == "object" && r.constructor !== Array) {
                    console.error("Data type must be array");
                }
                t += `<tr>`;
                r.forEach((v, vci) => {
                    if (vci < Object.keys(_.th).length) {
                        t += `<td>${v}</td>`;
                    } else if (_.hx) {
                        t += `<td class="d-none">${v}</td>`;
                    }
                });
                t += `</tr>`;
            });
            t += `</tbody></table>`;
            _.qa(s, (n, i) => {
                _.gfc(t, i);
            });
        } else if ((_.c && _.c == "table") || _.d === false) {
            let c = 0;
            _.qa(s, (n, i) => {
                if (n.tagName.toLowerCase() === "table") {
                    c++;
                    if (col && typeof col == "array") {
                        col.forEach((r, i) => {
                            if (typeof r == "object") {
                                if (r.title) {
                                    n.querySelectorAll("th")[i].innerHTML = r.title;
                                }
                                if (r.html) {
                                    this.th[i] = r.html;
                                } else {
                                    this.th[i] = "";
                                }
                            } else if (["string", "number"].includes(typeof r)) {
                                this.th[i] = r;
                            } else if (typeof r == "array") {
                                if (r[1]) {
                                    n.querySelectorAll("th")[i].innerHTML = r[0];
                                    this.th[i] = r[1];
                                }
                                if (r[0]) {
                                    this.th[i] = r[0];
                                } else {
                                    this.th[i] = "";
                                }
                            } else {
                                this.th[i] = "";
                            }
                        });
                    } else if (col && typeof col == "object") {
                        for (let i in col) {
                            if (["string", "number"].includes(typeof col[i])) {
                                _.th[i] = col[i];
                            } else if (typeof col[i] == "array") {
                                if (col[i][1]) {
                                    n.querySelectorAll("th")[i].innerHTML = col[i][0];
                                    _.th[i] = col[i][0];
                                } else if (col[i][0]) {
                                    _.th[i] = col[i][0];
                                } else {
                                    _.th[i] = "";
                                }
                            } else if (typeof col[i] == "object") {
                                if (col[i].title) {
                                    n.querySelectorAll("th")[i].innerHTML = col[i].title;
                                }
                                if (col[i].html) {
                                    _.th[i] = col[i].html;
                                } else {
                                    _.th[i] = "";
                                }
                            } else {
                                _.th[i] = "";
                            }
                        }
                    } else {
                    }
                    _.tempd = [];
                    _.qa(
                        "tbody tr",
                        (cn, ci) => {
                            let tdv = [];
                            _.qa(
                                "td",
                                (v, vi) => {
                                    tdv.push(v.innerHTML);
                                },
                                cn
                            );
                            _.tempd.push(tdv);
                        },
                        n
                    );
                    _.gfc(n.outerHTML, i);
                    // _.tempd = false;
                }
            });
            if (c == 0) {
                console.error("No Table found.");
            }
        } else {
        }
    }
    h = () => {
        this.gt();
        this.qa(this.s, (n) => {
            n.style.display = null;
        });
        this.fev();
    };
}
