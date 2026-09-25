import fs from "node:fs/promises";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {Presentation, PresentationFile} from "@oai/artifact-tool";

const workspaceDir = process.cwd();
const skillDir = "/Users/my/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations";
const runtimePython = "/Users/my/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const stagingDir = path.join(workspaceDir, ".codex-finalizer");
const finalPath = path.join(workspaceDir, "output", "Tamas_Flower_CMS_Training_v5.pptx");
const screenshotPath = "/var/folders/d9/ntv7jp294dj4gqgyg5g7737c0000gn/T/TemporaryItems/NSIRD_screencaptureui_wTF1il/Screenshot 2026-09-25 at 09.46.28.png";
const imageRoot = path.join(workspaceDir, "public", "images", "enhanced");
const sourceRoot = path.join(workspaceDir, "public", "images", "source");
const logoPath = path.join(workspaceDir, "public", "images", "brand", "tamas-flower-logo.png");
const {resolvePresentationFont, finalizePresentation} = await import(pathToFileURL(path.join(skillDir, "container_tools", "artifact_tool_utils.mjs")).href);

await fs.mkdir(stagingDir, {recursive: true});
await fs.mkdir(path.dirname(finalPath), {recursive: true});

const body = resolvePresentationFont({fontFamily: "Arial"});
const display = resolvePresentationFont({fontFamily: "Georgia"});
const P = {paper: "#F8F4EE", white: "#FFFDFC", ink: "#292320", muted: "#756A64", rose: "#A65F6B", softRose: "#E8D4D5", sage: "#77806B", line: "#DDD4CC", warm: "#EADCCF"};
const deck = Presentation.create({slideSize: {width: 1280, height: 720}});

const assets = {};
async function img(name, relative, type = "image/webp") { assets[name] = {blob: await fs.readFile(relative), contentType: type}; }
await Promise.all([
  img("login", screenshotPath, "image/png"),
  img("logo", logoPath, "image/png"),
  img("hero", path.join(workspaceDir, ".tamas-ppt-build", "compatible-assets", "hero.jpg"), "image/jpeg"),
  img("pink", path.join(sourceRoot, "01_Fresh-Flowers", "tamas-fresh-pink-lily-bouquet-01.jpg"), "image/jpeg"),
  img("lily", path.join(sourceRoot, "01_Fresh-Flowers", "tamas-fresh-pink-lily-bouquet-04.jpg"), "image/jpeg"),
  img("pastel", path.join(sourceRoot, "01_Fresh-Flowers", "tamas-fresh-pastel-bouquet-02.jpg"), "image/jpeg"),
  img("rose", path.join(sourceRoot, "01_Fresh-Flowers", "tamas-fresh-rose-bouquet-01.jpg"), "image/jpeg"),
  img("wax", path.join(sourceRoot, "02_Wax-Flowers", "tamas-wax-flower-price-grid-01.jpg"), "image/jpeg"),
  img("wax2", path.join(sourceRoot, "02_Wax-Flowers", "tamas-wax-flower-price-grid-03.jpg"), "image/jpeg"),
  img("crochet", path.join(sourceRoot, "04_Crochet-Plush", "tamas-crochet-pink-character-bouquet-01.jpg"), "image/jpeg"),
  img("box", path.join(sourceRoot, "05_Flower-Box", "tamas-flower-box-heart-red-01.jpg"), "image/jpeg"),
  img("sourcePastel", path.join(sourceRoot, "01_Fresh-Flowers", "tamas-fresh-pastel-bouquet-06.jpg"), "image/jpeg"),
]);

function shape(slide, geometry, left, top, width, height, fill = "none", line = {fill: "none", width: 0}) {
  return slide.shapes.add({geometry, position: {left, top, width, height}, fill, line});
}
function text(slide, value, left, top, width, height, options = {}) {
  const s = shape(slide, "textbox", left, top, width, height);
  s.text = value;
  s.text.style = {typeface: options.font ?? body, fontSize: options.size ?? 22, color: options.color ?? P.ink, bold: options.bold ?? false, italic: options.italic ?? false, autoFit: "shrink", ...options.style};
  return s;
}
function label(slide, value, left, top, width = 300) { return text(slide, value.toUpperCase(), left, top, width, 24, {size: 12, bold: true, color: P.rose}); }
function title(slide, value, sub = "") { text(slide, value, 70, 58, 820, 90, {font: display, size: 42, bold: false}); if (sub) text(slide, sub, 72, 150, 760, 46, {size: 18, color: P.muted}); }
function picture(slide, asset, left, top, width, height, alt, crop) { return slide.images.add({...assets[asset], alt, fit: "cover", position: {left, top, width, height}, geometry: "rect", ...(crop ? {crop} : {})}); }
function circle(slide, value, left, top, color = P.rose) { const c = shape(slide, "ellipse", left, top, 42, 42, color); c.text = value; c.text.style = {typeface: body, fontSize: String(value).length > 1 ? 15 : 20, bold: true, color: P.white, autoFit: "shrink"}; return c; }
function divider(slide, x, y, w) { shape(slide, "line", x, y, w, 0, "none", {fill: P.line, width: 1}); }
function note(slide, content) { slide.speakerNotes.textFrame.setText(content); }
function newSlide() { const slide = deck.slides.add(); slide.background.fill = P.paper; return slide; }

// 1
{ const s = newSlide(); picture(s, "hero", 688, 0, 592, 720, "Ảnh hoa thật tại Tamas Flower Store", {left: 0.06, top: 0, right: 0, bottom: 0}); shape(s, "rect", 0, 0, 688, 720, P.paper); picture(s, "logo", 72, 58, 120, 44, "Logo Tamas Flower Store"); text(s, "Tamas Flower Store", 72, 202, 555, 62, {font: display, size: 44}); text(s, "Hướng dẫn quản lý sản phẩm", 72, 270, 540, 55, {font: display, size: 34, color: P.rose}); text(s, "CMS & Website", 74, 343, 280, 32, {size: 20, color: P.muted}); divider(s, 72, 414, 370); text(s, "Dành cho chị chủ shop\nKhông cần biết kỹ thuật", 72, 445, 390, 72, {size: 20}); text(s, "Bản training nội bộ · 25.09.2026", 72, 648, 420, 24, {size: 14, color: P.muted}); note(s, "Mở đầu: Hôm nay chị chỉ cần nhớ cách quản lý sản phẩm. Những phần kỹ thuật sẽ do developer phụ trách."); }

// 2
{ const s = newSlide(); title(s, "Chị cần nhớ đúng 2 nơi", "Lưu cả hai link vào Dấu trang để mở lại khi cần"); picture(s, "pink", 70, 242, 480, 350, "Bó hoa Tamas", {left: 0, top: 0.04, right: 0, bottom: 0.04}); text(s, "1", 610, 250, 52, 52, {font: display, size: 42, color: P.rose}); text(s, "Website khách xem", 682, 253, 400, 36, {font: display, size: 28}); text(s, "tamas-flower-store-olive.vercel.app", 682, 300, 480, 28, {size: 17, color: P.muted}); divider(s, 610, 363, 540); text(s, "2", 610, 402, 52, 52, {font: display, size: 42, color: P.rose}); text(s, "Trang quản lý CMS", 682, 405, 400, 36, {font: display, size: 28}); text(s, "tamas-flower-store-olive.vercel.app/admin", 682, 452, 500, 28, {size: 17, color: P.muted}); text(s, "CMS là nơi chị thêm, sửa, ẩn sản phẩm.", 682, 516, 430, 48, {size: 19}); note(s, "Chỉ hai link này là cần dùng hằng ngày. Website là nơi khách xem; CMS là nơi chị quản lý."); }

// 3
{ const s = newSlide(); title(s, "Sản phẩm đi từ CMS ra website", "Chị cập nhật trong CMS, sau đó nhấn Publish"); const xs=[180, 545, 910]; const names=["Nhập sản phẩm", "Nhấn Publish", "Khách xem\nwebsite"]; const subs=["Tên, ảnh, giá, mô tả", "Lưu thay đổi", "Catalog và trang chi tiết"]; [0,1,2].forEach(i=>{shape(s,"ellipse",xs[i],270,170,170,i===1?P.rose:P.softRose); text(s,String(i+1),xs[i]+59,298,52,48,{font:display,size:36,color:i===1?P.white:P.rose}); text(s,names[i],xs[i]-20,468,230,54,{font:display,size:i===2?22:24}); text(s,subs[i],xs[i]-38,540,246,32,{size:17,color:P.muted});}); shape(s,"line",350,355,172,0,"none",{fill:P.rose,width:2}); shape(s,"line",715,355,172,0,"none",{fill:P.rose,width:2}); note(s, "Nói ngắn: chị chỉ nhập nội dung, sau đó bấm Publish. Website tự nhận phần còn lại."); }

// 4
{ const s = newSlide(); title(s, "Đăng nhập bằng Google", "Chị dùng đúng Gmail đã được mời vào project"); text(s, "Không cần tạo mật khẩu Sanity riêng.", 72, 225, 480, 42, {font: display, size: 30, color: P.rose}); text(s, "1. Mở trang quản lý\n2. Bấm Google\n3. Chọn Gmail của chị", 72, 298, 450, 125, {size: 24}); text(s, "Nếu không vào được, kiểm tra Gmail đó đã được mời chưa.", 72, 480, 455, 50, {size: 18, color: P.muted}); picture(s, "login", 588, 168, 620, 440, "Ảnh chụp thật trang đăng nhập CMS", {left: 0.365, top: 0.31, right: 0.365, bottom: 0.38}); circle(s,"1",792,406); text(s, "Bấm Google", 844,413,180,26,{size:18,bold:true,color:P.rose}); note(s, "Dùng ảnh chụp thật ngày 25/09/2026. Trỏ vào nút Google và nhắc chị không dùng Email/password."); }

// 5
{ const s = newSlide(); title(s, "Mời đúng Gmail là đủ", "Không cấp một bộ mật khẩu Sanity khác cho chị chủ"); picture(s,"rose",70,235,350,340,"Bó hoa pastel Tamas",{left:0.06,top:0,right:0.06,bottom:0}); label(s,"Người quản lý project",510,222); text(s,"Mời Gmail của chị vào\nSanity Manage → Project → Members",510,254,535,78,{font:display,size:28}); divider(s,510,356,595); label(s,"Chị chủ shop",510,390); text(s,"Mở /admin → bấm Google → chọn đúng Gmail",510,423,585,45,{font:display,size:26}); text(s,"Trên gói có Editor: dùng Editor.\nNếu project đang Free: Viewer không thể Publish; cần cân nhắc quyền Administrator hoặc nâng gói.",510,507,595,82,{size:18,color:P.muted}); note(s,"Giải thích quyền: Sanity gắn membership với phương thức đăng nhập. Mời email cho tài khoản Google và dùng Google để đăng nhập. Nguồn: Sanity Roles, cập nhật 09/09/2026."); }

// 6
{ const s = newSlide(); title(s, "Khu vực chị dùng hằng ngày", "Chị chỉ cần vào mục Sản phẩm"); picture(s,"crochet",762,164,446,464,"Hoa len và gấu bông Tamas",{left:0.04,top:0,right:0.04,bottom:0}); text(s,"Sản phẩm",72,246,450,48,{font:display,size:38,color:P.rose}); text(s,"Tất cả sản phẩm",72,311,420,36,{font:display,size:27}); text(s,"Tìm sản phẩm\nMở để sửa\nCreate để thêm mới\nPublish để lưu",112,385,430,142,{size:23}); text(s,"Không vào Settings, Tokens, API hay các phần cài đặt khác.",72,590,530,45,{size:18,color:P.muted}); note(s,"Sau login, vào mục Sản phẩm. Không cần chạm vào các mục cài đặt kỹ thuật."); }

// 7
{ const s = newSlide(); title(s, "Tạo một sản phẩm mới", "Chị điền lần lượt, rồi Publish một lần ở cuối"); const y=270; const steps=["Create", "Tên + Đường dẫn", "Danh mục + ảnh", "Giá + mô tả", "Publish"]; steps.forEach((v,i)=>{const x=70+i*230; circle(s,String(i+1),x,y); text(s,v,x-14,y+64,205,36,{font:display,size:21}); if(i<4) shape(s,"line",x+48,y+21,158,0,"none",{fill:P.rose,width:2});}); picture(s,"pastel",80,423,280,178,"Hoa tươi Tamas",{left:0,top:0.1,right:0,bottom:0.05}); picture(s,"wax2",450,423,280,178,"Hoa sáp Tamas",{left:0,top:0.04,right:0,bottom:0.04}); picture(s,"box",820,423,280,178,"Flower Box Tamas",{left:0,top:0,right:0,bottom:0}); note(s,"Chưa cần nhập hoàn hảo ngay lần đầu. Đi theo đúng thứ tự này để không bỏ sót các mục cần thiết."); }

// 8
{ const s = newSlide(); title(s, "Tên, Đường dẫn và Danh mục", "Danh mục quyết định khách tìm thấy sản phẩm ở đâu"); text(s,"Tên sản phẩm",70,230,270,32,{font:display,size:26,color:P.rose}); text(s,"Ví dụ: Bó hoa Pink Love",70,270,330,30,{size:19,color:P.muted}); text(s,"Đường dẫn",70,342,270,32,{font:display,size:26,color:P.rose}); text(s,"Tạo từ tên sản phẩm. Không tự đổi đường dẫn của mẫu đang bán nếu không cần.",70,382,425,63,{size:18,color:P.muted}); text(s,"Danh mục",525,228,260,32,{font:display,size:26,color:P.rose}); const cats=["Hoa tươi", "Hoa sáp", "Hoa lụa", "Hoa len & gấu bông", "Hộp hoa", "Hoa cưới"]; cats.forEach((c,i)=>text(s,`${i+1}.  ${c}`,525+(i>2?245:0),275+(i%3)*62,240,34,{size:18})); picture(s,"lily",1022,205,178,390,"Bó hoa tươi Tamas",{left:0.06,top:0,right:0.06,bottom:0}); note(s,"Chọn đúng danh mục. Trên website, Hộp hoa hiển thị với tên Flower Box."); }

// 9
{ const s = newSlide(); title(s, "Hình ảnh sản phẩm", "Một sản phẩm có từ 1 đến 5 ảnh. Ảnh đầu tiên là ảnh đại diện"); picture(s,"pink",70,230,510,360,"Ảnh đại diện sản phẩm",{left:0.02,top:0,right:0.02,bottom:0}); circle(s,"1",100,260); text(s,"Ảnh đầu tiên — ảnh đại diện",74,606,450,30,{font:display,size:23,color:P.rose}); picture(s,"lily",650,230,220,260,"Ảnh góc chụp khác",{left:0.05,top:0,right:0.05,bottom:0}); picture(s,"sourcePastel",895,230,220,260,"Ảnh góc chụp khác",{left:0.08,top:0,right:0.08,bottom:0}); text(s,"Ưu tiên ảnh rõ, đủ sáng, ảnh dọc và không có giá cũ. Không dùng screenshot Facebook hay ảnh mờ.",650,536,470,65,{size:20}); note(s,"Demo trực tiếp cách kéo ba ảnh vào. Nhắc chị ảnh đầu tiên là ảnh đại diện và giới hạn tối đa là năm ảnh."); }

// 10
{ const s = newSlide(); title(s, "Giá sản phẩm", "Chọn Loại giá trước, rồi điền Giá khi cần"); const col=[130,440,750]; const heads=["Giá cố định", "Giá từ", "Liên hệ"]; const values=["450000\n→ 450.000đ", "300000\n→ Từ 300.000đ", "Không nhập giá\n→ Liên hệ"]; heads.forEach((h,i)=>{text(s,h,col[i],244,235,42,{font:display,size:28,color:i===1?P.rose:P.ink}); divider(s,col[i],304,195); text(s,values[i],col[i],330,220,82,{size:23,bold:true,color:i===1?P.rose:P.ink});}); text(s,"Chỉ nhập số. Không nhập dấu chấm, chữ “đ” hay chữ “Từ” vào ô Giá.",130,536,800,50,{font:display,size:27,color:P.rose}); picture(s,"wax",1050,220,130,330,"Hoa sáp Tamas",{left:0.03,top:0,right:0.03,bottom:0}); note(s,"Đưa một ví dụ thật: 450000. Nói rằng chữ đ và Từ do website tự hiển thị."); }

// 11
{ const s = newSlide(); title(s, "Thông tin giúp khách hiểu mẫu hoa", "Mô tả ngắn, mô tả chi tiết, tông màu và dịp tặng"); picture(s,"pastel",70,228,390,390,"Bó hoa pastel Tamas",{left:0.03,top:0,right:0.03,bottom:0}); text(s,"Mô tả ngắn",540,232,390,32,{font:display,size:27,color:P.rose}); text(s,"1 đến 3 câu, ví dụ:\nBó hoa tone hồng nhẹ nhàng, phù hợp sinh nhật và kỷ niệm.",540,275,560,72,{size:19}); text(s,"Mô tả chi tiết",540,375,390,32,{font:display,size:27,color:P.rose}); text(s,"Ghi thêm loại hoa, tone màu, ý nghĩa hoặc lưu ý đặt trước.",540,417,560,47,{size:19}); text(s,"Tông màu & Dịp tặng",540,505,450,32,{font:display,size:27,color:P.rose}); text(s,"Ví dụ: Hồng, Kem · Sinh nhật, Tình yêu",540,549,530,32,{size:19}); note(s,"Các thông tin màu sắc và dịp tặng giúp khách tìm ở catalog và giúp sản phẩm hiện trên trang dịp tặng phù hợp."); }

// 12
{ const s = newSlide(); title(s, "Bật và tắt hiển thị", "Đây là cách an toàn để tạm ngừng bán một sản phẩm"); picture(s,"box",74,218,390,400,"Flower Box Tamas",{left:0,top:0,right:0,bottom:0}); shape(s,"ellipse",592,257,76,76,P.sage); text(s,"Bật",698,267,200,36,{font:display,size:31,color:P.sage}); text(s,"Khách nhìn thấy trên website",698,314,410,34,{size:20}); divider(s,592,397,530); shape(s,"ellipse",592,447,76,76,P.rose); text(s,"Tắt",698,457,200,36,{font:display,size:31,color:P.rose}); text(s,"Sản phẩm vẫn nằm trong CMS\nnhưng khách không thấy",698,504,410,54,{size:20}); text(s,"Hết hàng? Ưu tiên tắt hiển thị thay vì xóa.",590,612,550,32,{size:20,bold:true,color:P.rose}); note(s,"Khi tạm ngưng bán, tắt Đang hiển thị trên website rồi Publish. Cách này giữ lại dữ liệu để dùng lại sau."); }

// 13
{ const s = newSlide(); title(s, "Sản phẩm nổi bật ở trang chủ", "Trang chủ có danh sách chọn riêng"); picture(s,"crochet",70,218,310,400,"Hoa len Tamas",{left:0.05,top:0,right:0.05,bottom:0}); text(s,"Trong Sản phẩm",470,244,300,34,{font:display,size:27,color:P.rose}); text(s,"Ô “Sản phẩm nổi bật”\nchỉ là một đánh dấu trong sản phẩm.",470,287,330,68,{size:20}); divider(s,470,398,600); text(s,"Trong Trang chủ",470,440,300,34,{font:display,size:27,color:P.rose}); text(s,"Mục “Sản phẩm hiển thị trên trang chủ”\nchọn riêng tối đa 3 mẫu.",470,484,540,68,{size:20}); text(s,"Vì vậy, muốn đổi khu “Được yêu thích tại Tamas”, chọn trong mục Trang chủ hoặc nhờ developer hỗ trợ.",470,593,650,58,{size:19,bold:true,color:P.rose}); note(s,"Đây là điểm cần nói rõ để chị không hiểu nhầm. Đừng hứa bật Featured sẽ tự lên trang chủ."); }

// 14
{ const s = newSlide(); picture(s,"hero",0,0,1280,720,"Ảnh hoa thật tại Tamas",{left:0.1,top:0,right:0.1,bottom:0}); shape(s,"rect",0,0,1280,720,"#292320/70"); text(s,"Publish",72,165,560,80,{font:display,size:60,color:P.white}); text(s,"Sau khi kiểm tra xong, chị nhấn Publish để lưu và đưa thông tin mới lên website.",72,270,560,92,{size:25,color:P.white}); shape(s,"roundRect",72,424,230,68,P.rose,{fill:P.white,width:0}); text(s,"Publish",122,440,150,32,{font:display,size:25,color:P.white}); text(s,"Thông thường website cập nhật sau vài giây.",72,532,520,32,{size:20,color:"#F8F4EE"}); note(s,"Dừng lại ở thao tác Publish. Nhắc chị chỉ cần nhấn một lần rồi chờ vài giây."); }

// 15
{ const s = newSlide(); title(s, "Kiểm tra sản phẩm trên website", "Sau Publish, luôn mở catalog và trang chi tiết để xem lại"); picture(s,"wax",70,232,300,350,"Ảnh sản phẩm trên website",{left:0.02,top:0,right:0.02,bottom:0}); text(s,"1. Vào /san-pham",465,238,460,34,{font:display,size:27,color:P.rose}); text(s,"Tìm bằng tên, màu hoặc dịp tặng.",465,280,530,32,{size:20}); text(s,"2. Kiểm tra danh sách",465,366,460,34,{font:display,size:27,color:P.rose}); text(s,"Ảnh đại diện · tên · giá · danh mục",465,408,530,32,{size:20}); text(s,"3. Mở trang chi tiết",465,494,460,34,{font:display,size:27,color:P.rose}); text(s,"Kiểm tra thêm ảnh, mô tả, tông màu và dịp tặng.",465,536,590,48,{size:20}); text(s,"Website tự xử lý tìm kiếm, lọc danh mục và phân trang.",70,628,900,27,{size:17,color:P.muted}); note(s,"Website thực tế đã được kiểm tra ở /san-pham và /san-pham/forever-pink. Khi training, cho chị tự tìm sản phẩm vừa tạo."); }

// 16
{ const s = newSlide(); title(s, "Sửa, ẩn hoặc xóa sản phẩm", "Mọi thay đổi cần Publish lại"); const titles=["Sửa", "Ẩn", "Xóa"]; const copies=["Mở sản phẩm\nSửa nội dung\nPublish", "Tắt Đang hiển thị\nPublish\nGiữ lại dữ liệu", "Chỉ khi chắc chắn\nDelete\nXác nhận"]; const colors=[P.sage,P.rose,P.ink]; titles.forEach((h,i)=>{const x=86+i*370; text(s,h,x,255,250,44,{font:display,size:34,color:colors[i]}); divider(s,x,317,260); text(s,copies[i],x,346,260,92,{size:22});}); picture(s,"rose",84,500,230,126,"Bó hoa Tamas",{left:0.04,top:0.1,right:0.04,bottom:0.1}); picture(s,"wax2",454,500,230,126,"Hoa sáp Tamas",{left:0.04,top:0.1,right:0.04,bottom:0.1}); picture(s,"lily",824,500,230,126,"Hoa tươi Tamas",{left:0.04,top:0.1,right:0.04,bottom:0.1}); text(s,"Ưu tiên ẩn khi hết hàng hoặc muốn tạm dừng bán.",80,648,670,28,{size:19,bold:true,color:P.rose}); note(s,"Xóa là thao tác cuối cùng. Luôn ưu tiên tắt Đang hiển thị trên website khi chưa chắc."); }

// 17
{ const s = newSlide(); title(s, "Nếu có vấn đề", "Kiểm tra nhanh trước khi liên hệ developer"); const rows=[["1", "Đã nhấn Publish chưa?"],["2", "Đang hiển thị trên website đã bật chưa?"],["3", "Có tên, Đường dẫn và ít nhất một ảnh chưa?"],["4", "Danh mục và Dịp tặng có đúng không?"]]; rows.forEach((r,i)=>{const y=215+i*86; circle(s,r[0],78,y,i===3?P.sage:P.rose); text(s,r[1],145,y+5,725,34,{font:display,size:25}); divider(s,145,y+58,710);}); picture(s,"pastel",935,210,240,390,"Bó hoa pastel Tamas",{left:0.08,top:0,right:0.08,bottom:0}); text(s,"Vẫn chưa đúng? Chụp màn hình sản phẩm trong CMS rồi gửi developer.",78,610,750,42,{size:20,bold:true,color:P.rose}); note(s,"Chị không cần tự xử lý phần kỹ thuật. Nếu 4 bước này không giải quyết được, gửi ảnh chụp màn hình cho developer."); }

// 18
{ const s = newSlide(); title(s, "Quy trình 12 bước", "Chị có thể chụp hoặc in slide này để dùng mỗi lần thêm hoa"); const list=["Mở CMS", "Bấm Google", "Vào Sản phẩm", "Chọn Create", "Tên + Đường dẫn", "Danh mục", "1–5 ảnh", "Loại giá + giá", "Mô tả", "Màu + dịp", "Bật hiển thị", "Publish + kiểm tra"]; list.forEach((v,i)=>{const col=i<6?0:1; const row=i%6; const x=80+col*530; const y=226+row*58; text(s,String(i+1),x,y+5,60,28,{font:display,size:23,color:i===11?P.sage:P.rose,bold:true}); text(s,v,x+70,y+7,380,28,{size:21});}); divider(s,80,595,1090); text(s,"Nhớ: Không cần mật khẩu Sanity riêng. Chỉ bấm Google và chọn đúng Gmail đã được mời.",80,620,1050,34,{font:display,size:23,color:P.rose}); note(s,"Kết thúc bằng slide này. Khuyến khích chị lưu bài trình chiếu và file cheat sheet để tự xem lại."); }

const candidatePath = path.join(stagingDir, "tamas-training-candidate.pptx");
await (await PresentationFile.exportPptx(deck)).save(candidatePath);

const result = await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: runtimePython,
  integrityValidatorPath: path.join(skillDir, "container_tools", "inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools", "inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit"],
  explicitTotalSlideCount: 18,
  requiredNativeTableOwnerSlides: [],
  fontPolicy: {basis: "design", families: [body, display]},
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "Tamas_Flower_CMS_Training_v5.validation.json"),
});
console.log(JSON.stringify({finalPath, result}, null, 2));
