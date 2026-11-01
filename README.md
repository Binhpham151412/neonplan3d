# NeonPlan 3D – bản tiếng Việt

Vẽ mặt bằng ngôi nhà ngay trong Home Assistant và xem nó như một ngôi nhà 3D phát sáng: đèn sáng theo màu, rèm và cửa
chuyển động, camera, năng lượng chạy trong tường. Giao diện có **tiếng Việt** (tự bật khi Home Assistant để ngôn ngữ
Tiếng Việt) và tiếng Anh.

---

## Chạy trên máy và mở thẳng căn hộ của bạn

Cần cài **Node.js 24** (<https://nodejs.org>) và **Git**.

```bash
git clone https://github.com/Binhpham151412/neonplan3d.git
cd neonplan3d/frontend
npm install
npm start
```

`npm start` mở trình duyệt tại <http://localhost:8000/preview/index.html> và vào thẳng **căn hộ của bạn, bằng tiếng
Việt**. Bấm **Ctrl+C** trong cửa sổ lệnh để tắt.

- Đã cài rồi thì lần sau chỉ cần `cd neonplan3d/frontend` rồi `npm start`.
- Cổng 8000 đang bận thì chọn cổng khác: `npm start -- 8080`.

### File căn hộ: `private/home.neonplan.json`

Trang xem trước đọc căn hộ từ file **`private/home.neonplan.json`**. Thư mục `private/` **không bao giờ được đưa lên
GitHub** (đã có trong `.gitignore`), nên mặt bằng nhà bạn chỉ nằm trên máy của bạn.

- **Máy mới / vừa clone:** chép file `home.neonplan.json` của bạn vào thư mục `private/` (tạo thư mục nếu chưa có).
  Chưa có file thì trang sẽ hiện nhà mẫu.
- **Lưu thay đổi:** trang xem trước **không tự lưu**. Tải lại trang là mất những gì vừa sửa. Muốn giữ lại thì vào
  **Chỉnh sửa → ⚙ Cài đặt → 💾 Sao lưu → Xuất**, rồi đổi tên file vừa tải về thành `home.neonplan.json` và chép đè vào `private/`.
- **Tạo từ file JSON mặt bằng** (định dạng `neonplan-import`, ví dụ do AI viết theo [docs/ai-import.md](docs/ai-import.md)):
  mở trang import <https://neonplan3d.mastershort.de/import/>, kéo file vào, bấm *Download the NeonPlan file*, rồi lưu
  thành `private/home.neonplan.json`.

### Các địa chỉ hữu ích

| Địa chỉ | Hiện gì |
|---|---|
| `http://localhost:8000/preview/index.html` | Căn hộ của bạn, tiếng Việt |
| `…/preview/index.html?lang=en` | Căn hộ của bạn, tiếng Anh |
| `…/preview/index.html?demo` | Nhà mẫu (dữ liệu giả, tiếng Đức) |
| `…/preview/index.html?demo&lang=vi` | Nhà mẫu, tiếng Việt |
| `…/preview/index.html?empty` | Mặt bằng trống, để vẽ từ đầu |

Trang xem trước dùng một Home Assistant **giả lập**: đèn, cảm biến và camera trong danh sách thiết bị là dữ liệu mẫu,
không phải thiết bị thật của bạn.

---

## Sửa code

Mã nguồn giao diện nằm trong `frontend/src/` (Lit 3 + TypeScript, three.js cho 3D). Các bundle đã build nằm trong
`custom_components/neonplan3d/frontend/` và **được commit cùng code**, nên sau khi sửa phải build lại:

```bash
cd frontend
npm run build      # build lại bundle (có kiểm tra giới hạn dung lượng)
npm run typecheck  # kiểm tra kiểu TypeScript
npm test           # chạy test
```

- Chữ giao diện tiếng Việt nằm trong `frontend/lang/vi.json`. Tiếng Anh và tiếng Đức nằm trong `frontend/src/i18n.ts`.
- Ở múi giờ Việt Nam có 2 test (đường đi mặt trời, đếm phát hiện camera) lỗi sẵn từ bản gốc. Chạy test theo giờ UTC thì
  tất cả đều qua: PowerShell `$env:TZ="UTC"; npm test`, Git Bash `TZ=UTC npm test`.

---

## Cài vào Home Assistant

1. **HACS → ⋮ (góc trên bên phải) → Custom repositories**, thêm `https://github.com/Binhpham151412/neonplan3d`,
   loại **Integration**. Nếu đang cài NeonPlan 3D từ bản gốc thì gỡ bản đó trong HACS trước. Mặt bằng được lưu trong
   Home Assistant nên không bị mất, nhưng nên **Sao lưu tất cả** trước cho chắc.
2. Mở **NeonPlan 3D** trong HACS → **Download**, rồi **Settings → System → Restart**.
3. **Settings → Devices & services → Add integration → NeonPlan 3D**. Mục **NeonPlan 3D** sẽ hiện ở thanh bên.
4. Bật tiếng Việt: bấm **tên tài khoản** ở góc dưới thanh bên → **Language → Tiếng Việt**.
5. Đưa căn hộ vào: **NeonPlan 3D → Chỉnh sửa → ⚙ Cài đặt → 💾 Sao lưu → Nhập …**, chọn `home.neonplan.json`. Bước này thay toàn bộ
   mặt bằng đang có, trạng thái cũ được giữ lại làm điểm khôi phục.

---

## Cập nhật từ bản gốc

Bản này là fork của [Mastershort/neonplan3d](https://github.com/Mastershort/neonplan3d). Muốn lấy bản mới:

```bash
git remote add upstream https://github.com/Mastershort/neonplan3d.git   # chỉ làm một lần
git fetch upstream
git merge upstream/main
cd frontend
npm run build
```

Các file bundle trong `custom_components/neonplan3d/frontend/` thường bị xung đột khi merge. Cứ giữ bản nào cũng được,
rồi chạy `npm run build` để tạo lại, kiểm tra xong thì commit và push. Đừng bấm **Sync fork** trên GitHub, vì nó không
build lại bundle được.

---

## Giấy phép

MIT – xem [LICENSE](LICENSE). Dựa trên NeonPlan 3D của Mastershort.
