/**
 * HỆ THỐNG KHUNG CHƯƠNG TRÌNH TOÁN PHỔ THÔNG (GDPT 2018)
 * Bộ sách: Kết nối tri thức với cuộc sống (Lớp 6 - Lớp 12 & Chuyên đề học tập)
 * Tích hợp công cụ nội suy ma trận đặc tả Công văn 7991/BGDĐT & Trộn đa mã đề (2 - 12 mã đề)
 */

(function(window) {
    'use strict';

    // =========================================================================
    // 1. CƠ SỞ DỮ LIỆU CHƯƠNG TRÌNH TOÁN KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
    // =========================================================================
    const MATH_CURRICULUM_KNTT = {
        "6": {
            gradeName: "Toán Lớp 6",
            chapters: [
                {
                    id: "c1", name: "Chương I: Tập hợp các số tự nhiên", volume: "Tập 1",
                    lessons: [
                        "Bài 1: Tập hợp", "Bài 2: Cách ghi số tự nhiên", "Bài 3: Thứ tự trong tập hợp các số tự nhiên",
                        "Bài 4: Phép cộng và phép trừ", "Bài 5: Phép nhân và phép chia", "Bài 6: Lũy thừa với số mũ tự nhiên",
                        "Bài 7: Thứ tự thực hiện các phép tính"
                    ],
                    keywords: ["tap hop", "so tu nhien", "phep cong", "phep tru", "phep nhan", "phep chia", "luy thua", "thu tu thuc hien"],
                    outcomes: {
                        "Nhận biết": "Nhận biết được tập hợp, phần tử của tập hợp, các chữ số và thứ tự trong tập hợp số tự nhiên.",
                        "Thông hiểu": "Thực hiện thành thạo các phép tính cộng, trừ, nhân, chia, lũy thừa với số mũ tự nhiên.",
                        "Vận dụng": "Vận dụng thứ tự thực hiện phép tính và tính chất phép toán để giải bài toán thực tế."
                    }
                },
                {
                    id: "c2", name: "Chương II: Tính chia hết trong tập hợp các số tự nhiên", volume: "Tập 1",
                    lessons: [
                        "Bài 8: Quan hệ chia hết và tính chất", "Bài 9: Dấu hiệu chia hết", "Bài 10: Số nguyên tố",
                        "Bài 11: Ước chung, ƯCLN", "Bài 12: Bội chung, BCNN"
                    ],
                    keywords: ["chia het", "dau hieu chia het", "so nguyen to", "hop so", "uoc chung", "ucln", "boi chung", "bcnn"],
                    outcomes: {
                        "Nhận biết": "Nhận biết được quan hệ chia hết, dấu hiệu chia hết cho 2, 3, 5, 9; số nguyên tố và hợp số.",
                        "Thông hiểu": "Tìm được tập hợp các ước, bội; phân tích số ra thừa số nguyên tố; tìm ƯCLN và BCNN.",
                        "Vận dụng": "Vận dụng ƯCLN và BCNN để giải quyết các bài toán chia đều, chu kỳ lặp lại trong đời sống."
                    }
                },
                {
                    id: "c3", name: "Chương III: Số nguyên", volume: "Tập 1",
                    lessons: [
                        "Bài 13: Tập hợp các số nguyên", "Bài 14: Phép cộng và phép trừ số nguyên", "Bài 15: Quy tắc dấu ngoặc",
                        "Bài 16: Phép nhân số nguyên", "Bài 17: Phép chia hết. Bội và ước của một số nguyên"
                    ],
                    keywords: ["so nguyen", "so nguyen am", "truc so", "quy tac dau ngoac", "boi va uoc cua so nguyen"],
                    outcomes: {
                        "Nhận biết": "Nhận biết số nguyên âm, tập hợp số nguyên và biểu diễn trên trục số.",
                        "Thông hiểu": "Thực hiện phép tính cộng, trừ, nhân, chia số nguyên và áp dụng quy tắc dấu ngoặc.",
                        "Vận dụng": "Vận dụng số nguyên vào mô tả các đại lượng có hướng (nhiệt độ, độ cao, tài chính)."
                    }
                },
                {
                    id: "c4", name: "Chương IV: Một số hình phẳng trong thực tiễn", volume: "Tập 1",
                    lessons: [
                        "Bài 18: Hình tam giác đều, hình vuông, hình lục giác đều",
                        "Bài 19: Hình chữ nhật, hình thoi, hình bình hành, hình thang cân",
                        "Bài 20: Chu vi và diện tích của một số tứ giác đã học"
                    ],
                    keywords: ["tam giac deu", "hinh vuong", "luc giac deu", "hinh chu nhat", "hinh thoi", "hinh binh hanh", "hinh thang can", "chu vi", "dien tich"],
                    outcomes: {
                        "Nhận biết": "Nhận dạng các hình phẳng: tam giác đều, hình vuông, lục giác đều, hình chữ nhật, hình thoi, hình bình hành, hình thang cân.",
                        "Thông hiểu": "Mô tả tính chất về cạnh, góc, đường chéo của các hình phẳng cơ bản.",
                        "Vận dụng": "Tính chu vi và diện tích của các hình tứ giác trong bài toán thực tế đo đạc, xây dựng."
                    }
                },
                {
                    id: "c5", name: "Chương V: Tính đối xứng của hình phẳng trong tự nhiên", volume: "Tập 1",
                    lessons: ["Bài 21: Hình có trục đối xứng", "Bài 22: Hình có tâm đối xứng"],
                    keywords: ["truc doi xung", "tam doi xung", "tinh doi xung"],
                    outcomes: {
                        "Nhận biết": "Nhận biết được hình có trục đối xứng, hình có tâm đối xứng trong hình học và tự nhiên.",
                        "Thông hiểu": "Xác định được trục đối xứng và tâm đối xứng của các hình phẳng quen thuộc.",
                        "Vận dụng": "Nhận biết và ứng dụng tính đối xứng trong thiết kế, mỹ thuật và tự nhiên."
                    }
                },
                {
                    id: "c6", name: "Chương VI: Phân số", volume: "Tập 2",
                    lessons: [
                        "Bài 23: Mở rộng phân số. Phân số bằng nhau", "Bài 24: So sánh phân số. Hỗn số dương",
                        "Bài 25: Phép cộng và phép trừ", "Bài 26: Phép nhân và phép chia", "Bài 27: Hai bài toán về phân số"
                    ],
                    keywords: ["phan so", "phan so bang nhau", "so sanh phan so", "hon so", "hai bai toan ve phan so"],
                    outcomes: {
                        "Nhận biết": "Nhận biết phân số, phân số bằng nhau, hỗn số dương.",
                        "Thông hiểu": "So sánh phân số; thực hiện thành thạo phép cộng, trừ, nhân, chia phân số.",
                        "Vận dụng": "Giải hai bài toán về phân số: tìm giá trị phân số của một số và tìm một số khi biết giá trị phân số."
                    }
                },
                {
                    id: "c7", name: "Chương VII: Số thập phân", volume: "Tập 2",
                    lessons: [
                        "Bài 28: Số thập phân", "Bài 29: Tính toán với số thập phân", "Bài 30: Làm tròn và ước lượng",
                        "Bài 31: Một số bài toán về tỉ số và tỉ số phần trăm"
                    ],
                    keywords: ["so thap phan", "lam tron", "uoc luong", "ti so", "ti so phan tram"],
                    outcomes: {
                        "Nhận biết": "Nhận biết số thập phân âm, số thập phân dương, tỉ số và tỉ số phần trăm.",
                        "Thông hiểu": "Thực hiện phép tính với số thập phân; làm tròn số và ước lượng kết quả.",
                        "Vận dụng": "Giải quyết các bài toán thực tế liên quan đến tỉ số phần trăm (lãi suất, giảm giá, pha chế)."
                    }
                },
                {
                    id: "c8", name: "Chương VIII: Những hình học cơ bản", volume: "Tập 2",
                    lessons: [
                        "Bài 32: Điểm và đường thẳng", "Bài 33: Điểm nằm giữa hai điểm. Tia",
                        "Bài 34: Đoạn thẳng. Độ dài đoạn thẳng", "Bài 35: Trung điểm của đoạn thẳng",
                        "Bài 36: Góc", "Bài 37: Số đo góc"
                    ],
                    keywords: ["diem", "duong thang", "tia", "doan thang", "trung diem", "goc", "so do goc"],
                    outcomes: {
                        "Nhận biết": "Nhận biết điểm, đường thẳng, tia, đoạn thẳng, trung điểm của đoạn thẳng, góc và các loại góc.",
                        "Thông hiểu": "Đo độ dài đoạn thẳng, đo góc và xác định điểm nằm giữa hai điểm.",
                        "Vận dụng": "Vận dụng tính độ dài đoạn thẳng, số đo góc trong hình vẽ và thực tiễn."
                    }
                },
                {
                    id: "c9", name: "Chương IX: Dữ liệu và xác suất thực nghiệm", volume: "Tập 2",
                    lessons: [
                        "Bài 38: Dữ liệu và thu thập dữ liệu", "Bài 39: Bảng thống kê và biểu đồ tranh",
                        "Bài 40: Biểu đồ cột", "Bài 41: Biểu đồ cột kép", "Bài 42: Kết quả có thể và sự kiện trong trò chơi, thí nghiệm",
                        "Bài 43: Xác suất thực nghiệm"
                    ],
                    keywords: ["thu thap du lieu", "bang thong ke", "bieu do tranh", "bieu do cot", "bieu do cot kep", "xac suat thuc nghiem"],
                    outcomes: {
                        "Nhận biết": "Nhận biết dữ liệu, bảng thống kê, biểu đồ cột, biểu đồ cột kép và các sự kiện thực nghiệm.",
                        "Thông hiểu": "Đọc và giải thích dữ liệu trên bảng thống kê, biểu đồ cột kép; tính xác suất thực nghiệm.",
                        "Vận dụng": "Phân tích số liệu biểu đồ và đưa ra nhận xét, kết luận trong các tình huống thực tế."
                    }
                }
            ]
        },

        "7": {
            gradeName: "Toán Lớp 7",
            chapters: [
                {
                    id: "c1", name: "Chương I: Số hữu tỉ", volume: "Tập 1",
                    lessons: [
                        "Bài 1: Tập hợp các số hữu tỉ", "Bài 2: Cộng, trừ, nhân, chia số hữu tỉ",
                        "Bài 3: Luỹ thừa với số mũ tự nhiên của một số hữu tỉ", "Bài 4: Thứ tự thực hiện các phép tính. Quy tắc chuyển vế"
                    ],
                    keywords: ["so huu ti", "luy thua so huu ti", "quy tac chuyen ve"],
                    outcomes: {
                        "Nhận biết": "Nhận biết số hữu tỉ, biểu diễn số hữu tỉ trên trục số và số đối của số hữu tỉ.",
                        "Thông hiểu": "Thực hiện phép tính với số hữu tỉ, quy tắc chuyển vế và lũy thừa với số mũ tự nhiên.",
                        "Vận dụng": "Vận dụng thứ tự thực hiện phép tính và quy tắc chuyển vế tìm x trong bài toán thực tiễn."
                    }
                },
                {
                    id: "c2", name: "Chương II: Số thực", volume: "Tập 1",
                    lessons: [
                        "Bài 5: Làm quen với số thập phân vô hạn tuần hoàn", "Bài 6: Số vô tỉ. Căn bậc hai số học", "Bài 7: Tập hợp các số thực"
                    ],
                    keywords: ["so thap phan vo han tuan hoan", "so vo ti", "can bac hai so hoc", "so thuc", "gia tri tuyet doi"],
                    outcomes: {
                        "Nhận biết": "Nhận biết số vô tỉ, căn bậc hai số học, tập hợp số thực và giá trị tuyệt đối của số thực.",
                        "Thông hiểu": "Tính căn bậc hai số học của một số; tính giá trị tuyệt đối và làm tròn số thực.",
                        "Vận dụng": "Ứng dụng số thực và căn bậc hai giải quyết các bài toán đo lường độ dài, diện tích."
                    }
                },
                {
                    id: "c3", name: "Chương III: Góc và đường thẳng song song", volume: "Tập 1",
                    lessons: [
                        "Bài 8: Góc ở vị trí đặc biệt. Tia phân giác của một góc", "Bài 9: Hai đường thẳng song song và dấu hiệu nhận biết",
                        "Bài 10: Tiên đề Euclid. Tính chất của hai đường thẳng song song", "Bài 11: Định lí và chứng minh định lí"
                    ],
                    keywords: ["goc ke bu", "goc doi dinh", "tia phan giac", "duong thang song song", "tien de euclid", "dinh li"],
                    outcomes: {
                        "Nhận biết": "Nhận biết hai góc kề bù, đối đỉnh; góc so le trong, đồng vị; tia phân giác của một góc.",
                        "Thông hiểu": "Chứng minh hai đường thẳng song song; tính số đo góc dựa vào tính chất hai đường thẳng song song.",
                        "Vận dụng": "Chứng minh định lí hình học và giải quyết các bài toán tính góc trong thực tế."
                    }
                },
                {
                    id: "c4", name: "Chương IV: Tam giác bằng nhau", volume: "Tập 1",
                    lessons: [
                        "Bài 12: Tổng các góc trong một tam giác", "Bài 13: Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất của tam giác",
                        "Bài 14: Trường hợp bằng nhau thứ hai và thứ ba", "Bài 15: Các trường hợp bằng nhau của tam giác vuông",
                        "Bài 16: Tam giác cân. Đường trung trực của đoạn thẳng"
                    ],
                    keywords: ["tong cac goc trong tam giac", "tam giac bang nhau", "c-c-c", "c-g-c", "g-c-g", "tam giac can", "duong trung truc"],
                    outcomes: {
                        "Nhận biết": "Nhận biết định lí tổng các góc trong tam giác; các trường hợp bằng nhau của tam giác và tam giác cân.",
                        "Thông hiểu": "Chứng minh hai tam giác bằng nhau, tam giác cân, đường trung trực của đoạn thẳng.",
                        "Vận dụng": "Vận dụng tam giác bằng nhau để chứng minh quan hệ song song, vuông góc, bằng nhau trong hình học."
                    }
                },
                {
                    id: "c5", name: "Chương V: Thu thập và biểu diễn dữ liệu", volume: "Tập 1",
                    lessons: ["Bài 17: Thu thập và phân loại dữ liệu", "Bài 18: Biểu đồ hình quạt tròn", "Bài 19: Biểu đồ đoạn thẳng"],
                    keywords: ["thu thap phan loai du lieu", "bieu do hinh quat tron", "bieu do doan thang"],
                    outcomes: {
                        "Nhận biết": "Nhận biết tính hợp lí của dữ liệu; biểu đồ hình quạt tròn và biểu đồ đoạn thẳng.",
                        "Thông hiểu": "Đọc và trích xuất thông tin từ biểu đồ hình quạt tròn và biểu đồ đoạn thẳng.",
                        "Vận dụng": "Lựa chọn dạng biểu đồ thích hợp và đưa ra xu hướng biến động dữ liệu."
                    }
                },
                {
                    id: "c6", name: "Chương VI: Tỉ lệ thức và đại lượng tỉ lệ", volume: "Tập 2",
                    lessons: [
                        "Bài 20: Tỉ lệ thức", "Bài 21: Tính chất của dãy tỉ số bằng nhau", "Bài 22: Đại lượng tỉ lệ thuận", "Bài 23: Đại lượng tỉ lệ nghịch"
                    ],
                    keywords: ["ti le thuc", "day ti so bang nhau", "ti le thuan", "ti le nghich"],
                    outcomes: {
                        "Nhận biết": "Nhận biết tỉ lệ thức, dãy tỉ số bằng nhau, đại lượng tỉ lệ thuận và tỉ lệ nghịch.",
                        "Thông hiểu": "Vận dụng tính chất tỉ lệ thức và dãy tỉ số bằng nhau để tìm các số chưa biết.",
                        "Vận dụng": "Giải các bài toán chia phần tỉ lệ trong thực tế đời sống và khoa học kĩ thuật."
                    }
                },
                {
                    id: "c7", name: "Chương VII: Biểu thức đại số và đa thức một biến", volume: "Tập 2",
                    lessons: [
                        "Bài 24: Biểu thức đại số", "Bài 25: Đa thức một biến", "Bài 26: Phép cộng và phép trừ đa thức một biến",
                        "Bài 27: Phép nhân đa thức một biến", "Bài 28: Phép chia đa thức một biến"
                    ],
                    keywords: ["bieu thuc dai so", "da thuc mot bien", "bac cua da thuc", "nghiem cua da thuc", "chia da thuc"],
                    outcomes: {
                        "Nhận biết": "Nhận biết biểu thức số, biểu thức đại số, đa thức một biến, bậc và nghiệm của đa thức.",
                        "Thông hiểu": "Thực hiện phép cộng, trừ, nhân, chia đa thức một biến; kiểm tra nghiệm của đa thức.",
                        "Vận dụng": "Vận dụng đa thức một biến giải các bài toán biểu diễn diện tích, thể tích và đại lượng biến thiên."
                    }
                },
                {
                    id: "c8", name: "Chương VIII: Làm quen với biến cố và xác suất của biến cố", volume: "Tập 2",
                    lessons: ["Bài 29: Làm quen với biến cố", "Bài 30: Làm quen với xác suất của biến cố"],
                    keywords: ["bien co", "bien co chac chan", "bien co khong the", "bien co ngau nhien", "xac suat bien co"],
                    outcomes: {
                        "Nhận biết": "Nhận biết biến cố chắc chắn, biến cố không thể và biến cố ngẫu nhiên.",
                        "Thông hiểu": "Tính xác suất của biến cố ngẫu nhiên trong các mô hình đồng khả năng đơn giản.",
                        "Vận dụng": "Dự đoán khả năng xảy ra của biến cố trong các trò chơi xác suất."
                    }
                },
                {
                    id: "c9", name: "Chương IX: Quan hệ giữa các yếu tố trong một tam giác", volume: "Tập 2",
                    lessons: [
                        "Bài 31: Quan hệ giữa góc và cạnh đối diện", "Bài 32: Quan hệ giữa đường vuông góc và đường xiên",
                        "Bài 33: Quan hệ giữa ba cạnh của một tam giác", "Bài 34: Sự đồng quy của ba đường trung tuyến, ba đường phân giác",
                        "Bài 35: Sự đồng quy của ba đường trung trực, ba đường cao"
                    ],
                    keywords: ["goc va canh doi dien", "duong vuong goc", "duong xien", "bat dang thuc tam giac", "trong tam", "truc tam", "tam duong tron noi tiep", "tam duong tron ngoai tiep"],
                    outcomes: {
                        "Nhận biết": "Nhận biết quan hệ góc - cạnh đối diện, bất đẳng thức tam giác và các đường đồng quy trong tam giác.",
                        "Thông hiểu": "Vận dụng tính chất trọng tâm, trực tâm, tâm đường tròn nội tiếp/ngoại tiếp tam giác.",
                        "Vận dụng": "Giải các bài toán tối ưu khoảng cách, vị trí đặt trạm và hình học thực tế."
                    }
                },
                {
                    id: "c10", name: "Chương X: Một số hình khối trong thực tiễn", volume: "Tập 2",
                    lessons: [
                        "Bài 36: Hình hộp chữ nhật và hình lập phương", "Bài 37: Hình lăng trụ đứng tam giác và hình lăng trụ đứng tứ giác"
                    ],
                    keywords: ["hinh hop chu nhat", "hinh lap phuong", "lang tru dung tam giac", "lang tru dung tu giac", "dien tich xung quanh", "the tich"],
                    outcomes: {
                        "Nhận biết": "Nhận biết đỉnh, cạnh, mặt đáy, mặt bên của hình hộp chữ nhật, hình lập phương, hình lăng trụ đứng.",
                        "Thông hiểu": "Tính diện tích xung quanh và thể tích của hình hộp chữ nhật, hình lập phương, lăng trụ đứng.",
                        "Vận dụng": "Giải các bài toán tính thể tích bình chứa, lượng vật liệu xây dựng thực tế."
                    }
                }
            ]
        },

        "8": {
            gradeName: "Toán Lớp 8",
            chapters: [
                {
                    id: "c1", name: "Chương I: Đa thức", volume: "Tập 1",
                    lessons: ["Bài 1: Đơn thức", "Bài 2: Đa thức", "Bài 3: Phép cộng và phép trừ đa thức", "Bài 4: Phép nhân đa thức", "Bài 5: Phép chia đa thức cho đơn thức"],
                    keywords: ["don thuc", "da thuc nhieu bien", "bac cua da thuc", "nhan da thuc", "chia da thuc cho don thuc"],
                    outcomes: {
                        "Nhận biết": "Nhận biết đơn thức, đa thức nhiều biến, bậc của đơn thức và đa thức.",
                        "Thông hiểu": "Thực hiện phép cộng, trừ, nhân đa thức nhiều biến và chia đa thức cho đơn thức.",
                        "Vận dụng": "Rút gọn biểu thức đại số và tính giá trị biểu thức trong các bài toán thực tiễn."
                    }
                },
                {
                    id: "c2", name: "Chương II: Hằng đẳng thức đáng nhớ và ứng dụng", volume: "Tập 1",
                    lessons: [
                        "Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu", "Bài 7: Lập phương của một tổng. Lập phương của một hiệu",
                        "Bài 8: Tổng và hiệu hai lập phương", "Bài 9: Phân tích đa thức thành nhân tử"
                    ],
                    keywords: ["hang dang thuc", "binh phuong cua tong", "hieu hai binh phuong", "lap phuong", "phan tich da thuc thanh nhan tu"],
                    outcomes: {
                        "Nhận biết": "Nhận biết 7 hằng đẳng thức đáng nhớ và các phương pháp phân tích đa thức thành nhân tử.",
                        "Thông hiểu": "Vận dụng hằng đẳng thức khai triển, rút gọn và phân tích đa thức thành nhân tử.",
                        "Vận dụng": "Tính nhanh giá trị biểu thức số và tìm x trong các phương trình tích."
                    }
                },
                {
                    id: "c3", name: "Chương III: Tứ giác", volume: "Tập 1",
                    lessons: ["Bài 10: Tứ giác", "Bài 11: Hình thang cân", "Bài 12: Hình bình hành", "Bài 13: Hình chữ nhật", "Bài 14: Hình thoi và hình vuông"],
                    keywords: ["tu giac", "hinh thang can", "hinh binh hanh", "hinh chu nhat", "hinh thoi", "hinh vuong", "tong cac goc tu giac"],
                    outcomes: {
                        "Nhận biết": "Nhận biết định nghĩa, tính chất và dấu hiệu nhận biết của hình thang cân, hình bình hành, hình chữ nhật, hình thoi, hình vuông.",
                        "Thông hiểu": "Chứng minh một tứ giác là hình thang cân, hình bình hành, hình chữ nhật, hình thoi, hình vuông.",
                        "Vận dụng": "Vận dụng tính chất tứ giác chứng minh quan hệ hình học và tính toán độ dài, góc."
                    }
                },
                {
                    id: "c4", name: "Chương IV: Định lí Thalès trong tam giác", volume: "Tập 1",
                    lessons: ["Bài 15: Định lí Thalès trong tam giác", "Bài 16: Đường trung bình của tam giác", "Bài 17: Tính chất đường phân giác của tam giác"],
                    keywords: ["dinh li thales", "dinh li thales dao", "duong trung binh tam giac", "duong phan giac tam giac"],
                    outcomes: {
                        "Nhận biết": "Nhận biết định lí Thalès, định lí Thalès đảo, đường trung bình và đường phân giác trong tam giác.",
                        "Thông hiểu": "Tính độ dài đoạn thẳng và chứng minh hai đường thẳng song song bằng định lí Thalès.",
                        "Vận dụng": "Ứng dụng định lí Thalès và tính chất đường phân giác đo chiều cao, khoảng cách không tới được."
                    }
                },
                {
                    id: "c5", name: "Chương V: Dữ liệu và biểu đồ", volume: "Tập 1",
                    lessons: ["Bài 18: Thu thập và phân loại dữ liệu", "Bài 19: Biểu diễn dữ liệu bằng bảng, biểu đồ", "Bài 20: Phân tích số liệu thống kê dựa vào biểu đồ"],
                    keywords: ["thu thap phan loai du lieu", "bieu dien du lieu", "phan tich so lieu thong ke"],
                    outcomes: {
                        "Nhận biết": "Nhận biết dữ liệu định tính, định lượng và tính đại diện của dữ liệu.",
                        "Thông hiểu": "Biểu diễn dữ liệu bằng các biểu đồ thích hợp và đọc dữ liệu phân tích.",
                        "Vận dụng": "Phân tích và phát hiện sai sót, quy luật của số liệu thống kê trong thực tiễn."
                    }
                },
                {
                    id: "c6", name: "Chương VI: Phân thức đại số", volume: "Tập 2",
                    lessons: [
                        "Bài 21: Phân thức đại số", "Bài 22: Tính chất cơ bản của phân thức đại số", "Bài 23: Phép cộng và phép trừ phân thức đại số", "Bài 24: Phép nhân và phép chia phân thức đại số"
                    ],
                    keywords: ["phan thuc dai so", "dieu kien xac dinh", "quy dong mau thuc", "cong tru phan thuc", "nhan chia phan thuc"],
                    outcomes: {
                        "Nhận biết": "Nhận biết phân thức đại số, điều kiện xác định và phân thức bằng nhau.",
                        "Thông hiểu": "Rút gọn phân thức và thực hiện phép cộng, trừ, nhân, chia các phân thức đại số.",
                        "Vận dụng": "Rút gọn biểu thức phân thức phức tạp và giải bài toán tìm giá trị nguyên của biến."
                    }
                },
                {
                    id: "c7", name: "Chương VII: Phương trình bậc nhất và hàm số bậc nhất", volume: "Tập 2",
                    lessons: [
                        "Bài 25: Phương trình bậc nhất một ẩn", "Bài 26: Giải bài toán bằng cách lập phương trình",
                        "Bài 27: Khái niệm hàm số và đồ thị của hàm số", "Bài 28: Hàm số bậc nhất và đồ thị của hàm số bậc nhất", "Bài 29: Hệ số góc của đường thẳng"
                    ],
                    keywords: ["phuong trinh bac nhat mot an", "giai bai toan bang cach lap phuong trinh", "ham so bac nhat", "he so goc", "do thi ham so bac nhat"],
                    outcomes: {
                        "Nhận biết": "Nhận biết phương trình bậc nhất một ẩn, hàm số bậc nhất $y = ax + b$ ($a \\neq 0$) và hệ số góc.",
                        "Thông hiểu": "Giải phương trình bậc nhất một ẩn; vẽ đồ thị hàm số bậc nhất và xác định vị trí tương đối hai đường thẳng.",
                        "Vận dụng": "Giải bài toán bằng cách lập phương trình bậc nhất mô tả các tình huống thực tế (chuyển động, năng suất, tiền bạc)."
                    }
                },
                {
                    id: "c8", name: "Chương VIII: Mở đầu về tính xác suất của biến cố", volume: "Tập 2",
                    lessons: ["Bài 30: Kết quả có thể của hành động, thực nghiệm", "Bài 31: Khái niệm xác suất thực nghiệm", "Bài 32: Mối liên hệ giữa xác suất thực nghiệm với xác suất"],
                    keywords: ["ket qua co the", "khong gian mau", "xac suat thuc nghiem", "xac suat li thuyet"],
                    outcomes: {
                        "Nhận biết": "Nhận biết không gian mẫu, các kết quả đồng khả năng và biến cố ngẫu nhiên.",
                        "Thông hiểu": "Tính xác suất của biến cố trong các mô hình xúc xắc, đồng xu, rút thẻ.",
                        "Vận dụng": "Sử dụng xác suất thực nghiệm để ước lượng xác suất lí thuyết trong thực tiễn."
                    }
                },
                {
                    id: "c9", name: "Chương IX: Tam giác đồng dạng", volume: "Tập 2",
                    lessons: [
                        "Bài 33: Hai tam giác đồng dạng", "Bài 34: Ba trường hợp đồng dạng của hai tam giác", "Bài 35: Định lí Pythagore và ứng dụng",
                        "Bài 36: Các trường hợp đồng dạng của hai tam giác vuông", "Bài 37: Hình đồng dạng"
                    ],
                    keywords: ["tam giac dong dang", "c-c-c", "c-g-c", "g-g", "dinh li pythagore", "dong dang tam giac vuong"],
                    outcomes: {
                        "Nhận biết": "Nhận biết hai tam giác đồng dạng, tỉ số đồng dạng, định lí Pythagore và tam giác vuông đồng dạng.",
                        "Thông hiểu": "Chứng minh hai tam giác đồng dạng theo các trường hợp; áp dụng định lí Pythagore tính độ dài.",
                        "Vận dụng": "Ứng dụng tam giác đồng dạng giải các bài toán đo gián tiếp khoảng cách và chiều cao ngoài thực địa."
                    }
                },
                {
                    id: "c10", name: "Chương X: Một số hình khối trong thực tiễn", volume: "Tập 2",
                    lessons: ["Bài 38: Hình chóp tam giác đều", "Bài 39: Hình chóp tứ giác đều"],
                    keywords: ["hinh chop tam giac deu", "hinh chop tu giac deu", "dien tich xung quanh hinh chop", "the tich hinh chop"],
                    outcomes: {
                        "Nhận biết": "Nhận biết hình chóp tam giác đều, hình chóp tứ giác đều (đỉnh, cạnh bên, mặt bên, mặt đáy, đường cao).",
                        "Thông hiểu": "Tính diện tích xung quanh và thể tích của hình chóp tam giác đều, hình chóp tứ giác đều.",
                        "Vận dụng": "Giải các bài toán thực tế liên quan đến lều chóp, kim tự tháp, bao bì sản phẩm."
                    }
                }
            ]
        },

        "9": {
            gradeName: "Toán Lớp 9",
            chapters: [
                {
                    id: "c1", name: "Chương I: Phương trình và hệ phương trình bậc nhất hai ẩn", volume: "Tập 1",
                    lessons: ["Bài 1: Phương trình bậc nhất hai ẩn", "Bài 2: Hệ hai phương trình bậc nhất hai ẩn", "Bài 3: Giải hệ hai phương trình bậc nhất hai ẩn"],
                    keywords: ["phuong trinh bac nhat hai an", "he phuong trinh bac nhat hai an", "phuong phap the", "phuong phap cong dai so"],
                    outcomes: {
                        "Nhận biết": "Nhận biết phương trình bậc nhất hai ẩn và hệ hai phương trình bậc nhất hai ẩn.",
                        "Thông hiểu": "Giải hệ phương trình bậc nhất hai ẩn bằng phương pháp thế và phương pháp cộng đại số.",
                        "Vận dụng": "Giải bài toán thực tế bằng cách lập hệ phương trình bậc nhất hai ẩn."
                    }
                },
                {
                    id: "c2", name: "Chương II: Phương trình và bất phương trình bậc nhất một ẩn", volume: "Tập 1",
                    lessons: [
                        "Bài 4: Bất đẳng thức. Bất phương trình bậc nhất một ẩn", "Bài 5: Giải bất phương trình bậc nhất một ẩn", "Bài 6: Giải bài toán bằng cách lập hệ phương trình, bất phương trình"
                    ],
                    keywords: ["bat dang thuc", "bat phuong trinh bac nhat mot an", "giai bat phuong trinh"],
                    outcomes: {
                        "Nhận biết": "Nhận biết bất đẳng thức, bất phương trình bậc nhất một ẩn và nghiệm của bất phương trình.",
                        "Thông hiểu": "Vận dụng các tính chất bất đẳng thức để giải bất phương trình bậc nhất một ẩn.",
                        "Vận dụng": "Giải quyết các bài toán tối ưu chi phí, điều kiện ràng buộc trong thực tế."
                    }
                },
                {
                    id: "c3", name: "Chương III: Căn bậc hai và căn bậc ba", volume: "Tập 1",
                    lessons: [
                        "Bài 7: Căn bậc hai và căn thức bậc hai", "Bài 8: Phép nhân và phép chia căn thức bậc hai",
                        "Bài 9: Biến đổi đơn giản biểu thức chứa căn thức bậc hai", "Bài 10: Căn bậc ba và căn thức bậc ba"
                    ],
                    keywords: ["can bac hai", "can thuc bac hai", "can bac ba", "truc can thuc o mau", "khu mau", "rut gon can thuc"],
                    outcomes: {
                        "Nhận biết": "Nhận biết căn bậc hai, căn thức bậc hai, căn bậc ba và điều kiện xác định.",
                        "Thông hiểu": "Thực hiện phép nhân, chia căn thức bậc hai; trục căn thức ở mẫu và rút gọn biểu thức.",
                        "Vận dụng": "Vận dụng rút gọn căn thức để giải phương trình vô tỉ và tính giá trị biểu thức phức tạp."
                    }
                },
                {
                    id: "c4", name: "Chương IV: Hệ thức lượng trong tam giác vuông", volume: "Tập 1",
                    lessons: ["Bài 11: Tỉ số lượng giác của góc nhọn", "Bài 12: Một số hệ thức giữa cạnh và góc trong tam giác vuông"],
                    keywords: ["ti so luong giac", "sin", "cos", "tan", "cot", "he thuc luong tam giac vuong", "giai tam giac vuong"],
                    outcomes: {
                        "Nhận biết": "Nhận biết tỉ số lượng giác của góc nhọn (sin, cos, tan, cot) và hệ thức giữa cạnh - góc trong tam giác vuông.",
                        "Thông hiểu": "Tính các tỉ số lượng giác của góc đặc biệt ($30^\\circ, 45^\\circ, 60^\\circ$) và giải tam giác vuông.",
                        "Vận dụng": "Ứng dụng giải tam giác vuông đo chiều cao công trình, khoảng cách vượt sông ngoài thực địa."
                    }
                },
                {
                    id: "c5", name: "Chương V: Đường tròn", volume: "Tập 1",
                    lessons: [
                        "Bài 13: Cung và dây cung", "Bài 14: Vị trí tương đối của đường thẳng và đường tròn",
                        "Bài 15: Vị trí tương đối của hai đường tròn", "Bài 16: Góc ở tâm, góc nội tiếp", "Bài 17: Góc tạo bởi tiếp tuyến và dây cung"
                    ],
                    keywords: ["duong tron", "cung va day cung", "tiep tuyen", "goc o tam", "goc noi tiep", "goc tao boi tiep tuyen va day cung"],
                    outcomes: {
                        "Nhận biết": "Nhận biết góc ở tâm, góc nội tiếp, góc tạo bởi tiếp tuyến và dây cung; vị trí tương đối đường thẳng - đường tròn.",
                        "Thông hiểu": "Chứng minh tiếp tuyến của đường tròn; tính số đo góc và cung bị chắn.",
                        "Vận dụng": "Vận dụng tính chất tiếp tuyến và góc nội tiếp chứng minh các quan hệ hình học phẳng."
                    }
                },
                {
                    id: "c6", name: "Chương VI: Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn", volume: "Tập 2",
                    lessons: [
                        "Bài 18: Hàm số y = ax² (a ≠ 0)", "Bài 19: Phương trình bậc hai một ẩn", "Bài 20: Định lí Viète và ứng dụng", "Bài 21: Giải bài toán bằng cách lập phương trình bậc hai"
                    ],
                    keywords: ["ham so y = ax2", "parabol", "phuong trinh bac hai", "dinh li viete", "giai bai toan bang cach lap phuong trinh bac hai"],
                    outcomes: {
                        "Nhận biết": "Nhận biết tính chất và đồ thị hàm số Parabol $y = ax^2$; dạng phương trình bậc hai một ẩn và công thức nghiệm.",
                        "Thông hiểu": "Giải phương trình bậc hai bằng biệt thức $\\Delta$; vận dụng định lí Viète tính nhẩm nghiệm và tìm tham số.",
                        "Vận dụng": "Giải các bài toán thực tế mô hình quỹ đạo parabol, tối ưu diện tích và lập phương trình bậc hai."
                    }
                },
                {
                    id: "c7", name: "Chương VII: Tần số và tần số tương đối", volume: "Tập 2",
                    lessons: ["Bài 22: Bảng tần số và biểu đồ tần số", "Bài 23: Bảng tần số tương đối và biểu đồ tần số tương đối", "Bài 24: Biểu diễn dữ liệu bằng biểu đồ"],
                    keywords: ["bang tan so", "tan so tuong doi", "bieu do tan so", "bieu do tan so tuong doi"],
                    outcomes: {
                        "Nhận biết": "Nhận biết tần số, tần số tương đối, bảng tần số ghép nhóm.",
                        "Thông hiểu": "Lập bảng tần số, bảng tần số tương đối và vẽ biểu đồ tần số (đoạn thẳng, hình cột).",
                        "Vận dụng": "Phân tích và đưa ra quyết định dựa trên bảng phân bố tần số tương đối trong thực tế."
                    }
                },
                {
                    id: "c8", name: "Chương VIII: Xác suất của biến cố trong một số mô hình xác suất đơn giản", volume: "Tập 2",
                    lessons: ["Bài 25: Xác suất của biến cố", "Bài 26: Xác suất trong một số mô hình đơn giản"],
                    keywords: ["xac suat cua bien co", "so ket qua thuan loi", "mo hinh dong kha nang"],
                    outcomes: {
                        "Nhận biết": "Nhận biết công thức cổ điển tính xác suất của biến cố ngẫu nhiên.",
                        "Thông hiểu": "Đếm số kết quả thuận lợi và tính xác suất biến cố trong các phép thử đơn giản.",
                        "Vận dụng": "Ứng dụng xác suất vào dự đoán kết quả trò chơi may rủi và quản trị rủi ro."
                    }
                },
                {
                    id: "c9", name: "Chương IX: Đường tròn ngoại tiếp và đường tròn nội tiếp", volume: "Tập 2",
                    lessons: [
                        "Bài 27: Đường tròn ngoại tiếp tam giác", "Bài 28: Đường tròn nội tiếp tam giác", "Bài 29: Tứ giác nội tiếp", "Bài 30: Đa giác đều và đường tròn"
                    ],
                    keywords: ["duong tron ngoai tiep tam giac", "duong tron noi tiep tam giac", "tu giac noi tiep", "da giac deu"],
                    outcomes: {
                        "Nhận biết": "Nhận biết đường tròn ngoại tiếp/nội tiếp tam giác, tứ giác nội tiếp và đa giác đều.",
                        "Thông hiểu": "Chứng minh một tứ giác nội tiếp đường tròn bằng tổng hai góc đối diện hoặc góc cùng nhìn một cạnh.",
                        "Vận dụng": "Vận dụng tứ giác nội tiếp giải các bài toán hình học tổng hợp và quỹ tích điểm."
                    }
                },
                {
                    id: "c10", name: "Chương X: Một số hình khối trong thực tiễn", volume: "Tập 2",
                    lessons: ["Bài 31: Hình trụ", "Bài 32: Hình nón và hình cầu"],
                    keywords: ["hinh tru", "hinh non", "hinh cau", "dien tich xung quanh", "the tich"],
                    outcomes: {
                        "Nhận biết": "Nhận biết hình trụ, hình nón, hình cầu (bán kính đáy, đường sinh, trục, chiều cao).",
                        "Thông hiểu": "Tính diện tích xung quanh, diện tích toàn phần và thể tích hình trụ, nón, cầu.",
                        "Vận dụng": "Giải các bài toán thực tiễn tính dung tích bình chứa, lượng sơn phủ bề mặt hình khối tròn xoay."
                    }
                }
            ]
        },

        "10": {
            gradeName: "Toán Lớp 10",
            chapters: [
                {
                    id: "c1", name: "Chương I: Mệnh đề và tập hợp", volume: "Tập 1",
                    lessons: ["Bài 1: Mệnh đề", "Bài 2: Tập hợp và các phép toán trên tập hợp"],
                    keywords: ["menh de", "menh de chua bien", "phu dinh", "keo theo", "tuong duong", "tap hop", "hop", "giao", "hieu", "phan bu"],
                    outcomes: {
                        "Nhận biết": "Nhận biết mệnh đề, phủ định mệnh đề, mệnh đề kéo theo; tập hợp và các tập con số thực.",
                        "Thông hiểu": "Thực hiện phép giao, hợp, hiệu của hai tập hợp; xác định tính đúng/sai của mệnh đề chứa kí hiệu $\\forall, \\exists$.",
                        "Vận dụng": "Vận dụng các phép toán tập hợp giải quyết bài toán phân loại và tập nghiệm bất phương trình."
                    }
                },
                {
                    id: "c2", name: "Chương II: Bất phương trình và hệ bất phương trình bậc nhất hai ẩn", volume: "Tập 1",
                    lessons: ["Bài 3: Bất phương trình bậc nhất hai ẩn", "Bài 4: Hệ bất phương trình bậc nhất hai ẩn"],
                    keywords: ["bat phuong trinh bac nhat hai an", "he bat phuong trinh bac nhat hai an", "mien nghiem", "quy hoach tuyen tinh", "gia tri lon nhat", "gia tri nho nhat"],
                    outcomes: {
                        "Nhận biết": "Nhận biết bất phương trình và hệ bất phương trình bậc nhất hai ẩn.",
                        "Thông hiểu": "Biểu diễn miền nghiệm của bất phương trình và hệ bất phương trình bậc nhất hai ẩn trên mặt phẳng Oxy.",
                        "Vận dụng": "Giải bài toán quy hoạch tuyến tính tìm giá trị lớn nhất, nhỏ nhất của hàm mục tiêu trong sản xuất, kinh doanh."
                    }
                },
                {
                    id: "c3", name: "Chương III: Hệ thức lượng trong tam giác", volume: "Tập 1",
                    lessons: ["Bài 5: Giá trị lượng giác của một góc từ 0° đến 180°", "Bài 6: Hệ thức lượng trong tam giác và giải tam giác"],
                    keywords: ["gia tri luong giac", "dinh li cosin", "dinh li sin", "cong thuc heron", "dien tich tam giac", "giai tam giac"],
                    outcomes: {
                        "Nhận biết": "Nhận biết giá trị lượng giác của góc $0^\\circ \\le \\alpha \\le 180^\\circ$; công thức định lí cosin, định lí sin, công thức diện tích.",
                        "Thông hiểu": "Áp dụng định lí cosin, định lí sin và công thức Heron để tính cạnh, góc, diện tích tam giác và bán kính $R, r$.",
                        "Vận dụng": "Giải tam giác ứng dụng trong trắc địa, đo góc nghiêng, khoảng cách giữa hai vị trí không tới được."
                    }
                },
                {
                    id: "c4", name: "Chương IV: Vectơ", volume: "Tập 1",
                    lessons: [
                        "Bài 7: Các khái niệm mở đầu về vectơ", "Bài 8: Tổng và hiệu của hai vectơ", "Bài 9: Tích của một số với một vectơ", "Bài 10: Tích vô hướng của hai vectơ"
                    ],
                    keywords: ["vecto", "hai vecto cung phuong", "hai vecto bang nhau", "tong hieu vecto", "quy tac 3 diem", "quy tac hinh binh hanh", "tich vo huong", "goc giua hai vecto"],
                    outcomes: {
                        "Nhận biết": "Nhận biết vectơ, phương, hướng, độ dài vectơ; quy tắc ba điểm, hình bình hành và tích vô hướng.",
                        "Thông hiểu": "Thực hiện phép cộng, trừ vectơ, nhân vectơ với số; tính tích vô hướng và góc giữa hai vectơ.",
                        "Vận dụng": "Vận dụng tích vô hướng chứng minh hai đường thẳng vuông góc, tính công của lực trong Vật lý."
                    }
                },
                {
                    id: "c5", name: "Chương V: Các số đặc trưng của mẫu số liệu không ghép nhóm", volume: "Tập 1",
                    lessons: ["Bài 11: Số gần đúng và sai số", "Bài 12: Các số đặc trưng đo xu thế trung tâm", "Bài 13: Các số đặc trưng đo mức độ phân tán"],
                    keywords: ["so gan dung", "sai so", "so trung binh", "trung vi", "tu phan vi", "mot", "khoang bien thien", "khoang tu phan vi", "phuong sai", "do lech chuan"],
                    outcomes: {
                        "Nhận biết": "Nhận biết số gần đúng, sai số tuyệt đối/tương đối; số trung bình, trung vị, tứ phân vị, mốt, khoảng biến thiên, độ lệch chuẩn.",
                        "Thông hiểu": "Tính các số đặc trưng đo xu thế trung tâm và mức độ phân tán của mẫu số liệu không ghép nhóm.",
                        "Vận dụng": "Sử dụng các số đặc trưng để so sánh, phân tích độ ổn định, mức độ phân tán của dữ liệu thực tế."
                    }
                },
                {
                    id: "c6", name: "Chương VI: Hàm số, đồ thị và ứng dụng", volume: "Tập 2",
                    lessons: ["Bài 14: Hàm số và đồ thị", "Bài 15: Hàm số bậc hai", "Bài 16: Dấu của tam thức bậc hai", "Bài 17: Phương trình quy về phương trình bậc hai"],
                    keywords: ["tap xac dinh", "dong bien nghich bien", "ham so bac hai", "parabol", "dau cua tam thuc bac hai", "phuong trinh chua can"],
                    outcomes: {
                        "Nhận biết": "Nhận biết tập xác định, tính đồng biến/nghịch biến; đỉnh và trục đối xứng của parabol $y = ax^2 + bx + c$; dấu tam thức bậc hai.",
                        "Thông hiểu": "Lập bảng biến thiên và vẽ đồ thị hàm số bậc hai; giải bất phương trình bậc hai và phương trình chứa căn thức dạng $\\sqrt{f(x)} = \\sqrt{g(x)}$.",
                        "Vận dụng": "Mô hình hóa bài toán thực tế bằng hàm số bậc hai (tối ưu doanh thu, quỹ đạo chuyển động ném)."
                    }
                },
                {
                    id: "c7", name: "Chương VII: Phương pháp tọa độ trong mặt phẳng", volume: "Tập 2",
                    lessons: [
                        "Bài 18: Tọa độ của vectơ và điểm", "Bài 19: Phương trình đường thẳng", "Bài 20: Phương trình đường tròn", "Bài 21: Ba đường conic"
                    ],
                    keywords: ["toa do diem", "toa do vecto", "phuong trinh duong thang", "vecto phap tuyen", "vecto chi phuong", "khoang cach tu diem den duong thang", "phuong trinh duong tron", "elip", "hyperbol", "parabol"],
                    outcomes: {
                        "Nhận biết": "Nhận biết tọa độ điểm, vectơ; phương trình tổng quát, tham số của đường thẳng; phương trình đường tròn và ba đường Conic (Elip, Hypebol, Parabol).",
                        "Thông hiểu": "Viết phương trình đường thẳng, đường tròn; tính khoảng cách từ điểm đến đường thẳng, góc giữa hai đường thẳng.",
                        "Vận dụng": "Giải các bài toán tương giao giữa đường thẳng và đường tròn, mô hình hóa quỹ đạo vệ tinh bằng đường Conic."
                    }
                },
                {
                    id: "c8", name: "Chương VIII: Đại số tổ hợp", volume: "Tập 2",
                    lessons: ["Bài 22: Quy tắc cộng và quy tắc nhân", "Bài 23: Hoán vị, chỉnh hợp và tổ hợp", "Bài 24: Nhị thức Newton"],
                    keywords: ["quy tac cong", "quy tac nhan", "so do cay", "hoan vi", "chinh hop", "to hop", "nhi thuc newton"],
                    outcomes: {
                        "Nhận biết": "Nhận biết quy tắc cộng, quy tắc nhân, định nghĩa và công thức tính hoán vị $P_n$, chỉnh hợp $A_n^k$, tổ hợp $C_n^k$, khai triển nhị thức Newton $(a+b)^4, (a+b)^5$.",
                        "Thông hiểu": "Phân biệt và vận dụng quy tắc đếm, hoán vị, chỉnh hợp, tổ hợp trong các bài toán đếm sắp xếp, chọn nhóm.",
                        "Vận dụng": "Giải các bài toán tổ hợp phức tạp và khai triển nhị thức Newton tìm hệ số của số hạng."
                    }
                },
                {
                    id: "c9", name: "Chương IX: Tính xác suất theo định nghĩa cổ điển", volume: "Tập 2",
                    lessons: ["Bài 25: Biến cố và không gian mẫu", "Bài 26: Xác suất của biến cố"],
                    keywords: ["khong gian mau", "bien co", "xac suat co dien", "quy tac cong xac suat", "bien co doi"],
                    outcomes: {
                        "Nhận biết": "Nhận biết phép thử ngẫu nhiên, không gian mẫu, biến cố và công thức xác suất cổ điển $P(A) = \\frac{n(A)}{n(\\Omega)}$.",
                        "Thông hiểu": "Tính số phần tử không gian mẫu và số kết quả thuận lợi bằng các công cụ đại số tổ hợp; tính xác suất biến cố đối.",
                        "Vận dụng": "Tính xác suất trong các tình huống thực tiễn có nhiều bước chọn ngẫu nhiên."
                    }
                }
            ],
            topicsExtend: [
                { id: "cd1", name: "Chuyên đề 1: Hệ phương trình bậc nhất ba ẩn", outcomes: { "Vận dụng": "Giải hệ phương trình bậc nhất ba ẩn bằng phương pháp Gauss và ứng dụng thực tiễn." } },
                { id: "cd2", name: "Chuyên đề 2: Ba đường conic và ứng dụng", outcomes: { "Vận dụng": "Ứng dụng tính chất tiêu điểm, đường chuẩn của Elip, Hypebol, Parabol." } },
                { id: "cd3", name: "Chuyên đề 3: Nhị thức Newton", outcomes: { "Vận dụng": "Khai triển nhị thức Newton tổng quát và ứng dụng tính tổng tổ hợp." } }
            ]
        },

        "11": {
            gradeName: "Toán Lớp 11",
            chapters: [
                {
                    id: "c1", name: "Chương I: Hàm số lượng giác và phương trình lượng giác", volume: "Tập 1",
                    lessons: [
                        "Bài 1: Giá trị lượng giác của góc lượng giác", "Bài 2: Công thức lượng giác", "Bài 3: Hàm số lượng giác", "Bài 4: Phương trình lượng giác cơ bản"
                    ],
                    keywords: ["goc luong giac", "cong thuc luong giac", "cong thuc cong", "nhan doi", "bien doi tich thanh tong", "ham so luong giac", "phuong trinh luong giac"],
                    outcomes: {
                        "Nhận biết": "Nhận biết góc lượng giác, công thức cộng, công thức nhân đôi; tập xác định, chu kì và đồ thị của các hàm lượng giác.",
                        "Thông hiểu": "Áp dụng công thức lượng giác biến đổi biểu thức; giải các phương trình lượng giác cơ bản $(\\sin x = m, \\cos x = m, \\tan x = m)$.",
                        "Vận dụng": "Mô hình hóa các hiện tượng tuần hoàn (sóng âm, dòng điện, chuyển động tròn) bằng hàm số lượng giác."
                    }
                },
                {
                    id: "c2", name: "Chương II: Dãy số. Cấp số cộng và cấp số nhân", volume: "Tập 1",
                    lessons: ["Bài 5: Dãy số", "Bài 6: Cấp số cộng", "Bài 7: Cấp số nhân"],
                    keywords: ["day so", "day so tang giam", "cap so cong", "cong sai", "cap so nhan", "cong boi", "tong n so hang"],
                    outcomes: {
                        "Nhận biết": "Nhận biết dãy số tăng, giảm, bị chặn; định nghĩa và công thức số hạng tổng quát của cấp số cộng, cấp số nhân.",
                        "Thông hiểu": "Xác định công sai $d$, công bội $q$; tính tổng $n$ số hạng đầu tiên $S_n$ của cấp số cộng và cấp số nhân.",
                        "Vận dụng": "Giải quyết các bài toán lãi kép, tăng trưởng dân số, phân rã chất phóng xạ và chuỗi tài chính."
                    }
                },
                {
                    id: "c3", name: "Chương III: Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm", volume: "Tập 1",
                    lessons: ["Bài 8: Mẫu số liệu ghép nhóm", "Bài 9: Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm"],
                    keywords: ["mau so lieu ghep nhom", "so trung binh ghep nhom", "trung vi ghep nhom", "tu phan vi ghep nhom", "mot ghep nhom"],
                    outcomes: {
                        "Nhận biết": "Nhận biết mẫu số liệu ghép nhóm và các khoảng/nhóm dữ liệu.",
                        "Thông hiểu": "Tính số trung bình, trung vị, tứ phân vị ($Q_1, Q_2, Q_3$), mốt của mẫu số liệu ghép nhóm.",
                        "Vận dụng": "Phân tích và đưa ra đánh giá, so sánh giữa các tập dữ liệu thống kê quy mô lớn trong thực tiễn."
                    }
                },
                {
                    id: "c4", name: "Chương IV: Quan hệ song song trong không gian", volume: "Tập 1",
                    lessons: [
                        "Bài 10: Điểm, đường thẳng và mặt phẳng", "Bài 11: Hai đường thẳng chéo nhau và hai đường thẳng song song",
                        "Bài 12: Đường thẳng và mặt phẳng song song", "Bài 13: Hai mặt phẳng song song", "Bài 14: Phép chiếu song song"
                    ],
                    keywords: ["duong thang mat phang", "hai duong thang cheo nhau", "duong thang song song mat phang", "hai mat phang song song", "phep chieu song song", "hinh lang tru"],
                    outcomes: {
                        "Nhận biết": "Nhận biết các tiên đề hình học không gian, vị trí tương đối giữa đường - đường, đường - mặt, mặt - mặt.",
                        "Thông hiểu": "Chứng minh đường thẳng song song mặt phẳng, hai mặt phẳng song song; xác định giao tuyến và thiết diện.",
                        "Vận dụng": "Vận dụng tính chất song song và phép chiếu song song vẽ hình biểu diễn các khối đa diện."
                    }
                },
                {
                    id: "c5", name: "Chương V: Giới hạn. Hàm số liên tục", volume: "Tập 1",
                    lessons: ["Bài 15: Giới hạn của dãy số", "Bài 16: Giới hạn của hàm số", "Bài 17: Hàm số liên tục"],
                    keywords: ["gioi han day so", "gioi han ham so", "gioi han vo cuc", "ham so lien tuc", "dinh li gia tri trung gian"],
                    outcomes: {
                        "Nhận biết": "Nhận biết giới hạn dãy số, giới hạn hàm số tại một điểm và vô cực; định nghĩa hàm số liên tục tại một điểm/trên khoảng.",
                        "Thông hiểu": "Tính các giới hạn hàm số và dãy số dạng vô định ($\\frac{0}{0}, \\frac{\\infty}{\\infty}$); xét tính liên tục của hàm số.",
                        "Vận dụng": "Áp dụng định lí giá trị trung gian chứng minh phương trình có nghiệm trong khoảng cho trước."
                    }
                },
                {
                    id: "c6", name: "Chương VI: Hàm số mũ và hàm số lôgarit", volume: "Tập 2",
                    lessons: [
                        "Bài 18: Lũy thừa", "Bài 19: Lôgarit", "Bài 20: Hàm số mũ và hàm số lôgarit", "Bài 21: Phương trình, bất phương trình mũ và lôgarit"
                    ],
                    keywords: ["luy thua so thuc", "logarit", "log", "ln", "ham so mu", "ham so logarit", "phuong trinh mu", "phuong trinh logarit", "bat phuong trinh mu"],
                    outcomes: {
                        "Nhận biết": "Nhận biết khái niệm, tính chất của lũy thừa, lôgarit; đồ thị và tính chất của hàm số mũ $y = a^x$ và hàm số lôgarit $y = \\log_a x$.",
                        "Thông hiểu": "Thực hiện biến đổi biểu thức mũ, lôgarit; giải phương trình, bất phương trình mũ và lôgarit cơ bản.",
                        "Vận dụng": "Mô hình hóa bài toán lãi suất kép, tăng trưởng vi khuẩn, độ pH và thang đo Richter động đất."
                    }
                },
                {
                    id: "c7", name: "Chương VII: Quan hệ vuông góc trong không gian", volume: "Tập 2",
                    lessons: [
                        "Bài 22: Hai đường thẳng vuông góc", "Bài 23: Đường thẳng vuông góc với mặt phẳng", "Bài 24: Hai mặt phẳng vuông góc",
                        "Bài 25: Khoảng cách", "Bài 26: Thể tích khối đa diện"
                    ],
                    keywords: ["hai duong thang vuong goc", "duong thang vuong goc mat phang", "hai mat phang vuong goc", "goc giua duong thang va mat phang", "goc phang nhi dien", "khoang cach", "the tich khoi chop", "the tich lang tru"],
                    outcomes: {
                        "Nhận biết": "Nhận biết đường vuông góc mặt, hai mặt phẳng vuông góc, góc giữa đường và mặt, góc nhị diện, khoảng cách và thể tích.",
                        "Thông hiểu": "Chứng minh quan hệ vuông góc; tính góc giữa đường và mặt, góc nhị diện; tính khoảng cách từ điểm đến mặt phẳng, khoảng cách giữa 2 đường chéo nhau.",
                        "Vận dụng": "Tính thể tích khối chóp, lăng trụ, hình hộp và giải quyết bài toán không gian thực tế."
                    }
                },
                {
                    id: "c8", name: "Chương VIII: Các quy tắc tính xác suất", volume: "Tập 2",
                    lessons: ["Bài 27: Biến cố giao và biến cố hợp", "Bài 28: Các quy tắc cộng và nhân xác suất"],
                    keywords: ["bien co giao", "bien co hop", "bien co doc lap", "quy tac cong xac suat", "quy tac nhan xac suat"],
                    outcomes: {
                        "Nhận biết": "Nhận biết biến cố giao, biến cố hợp, hai biến cố xung khắc, hai biến cố độc lập.",
                        "Thông hiểu": "Vận dụng quy tắc cộng xác suất $P(A \\cup B) = P(A) + P(B) - P(AB)$ và quy tắc nhân xác suất cho hai biến cố độc lập $P(AB) = P(A)P(B)$.",
                        "Vận dụng": "Tính xác suất của các hệ thống hoạt động nối tiếp, song song và các phép thử xác suất phức hợp."
                    }
                },
                {
                    id: "c9", name: "Chương IX: Đạo hàm", volume: "Tập 2",
                    lessons: ["Bài 29: Đạo hàm", "Bài 30: Các quy tắc tính đạo hàm", "Bài 31: Đạo hàm cấp hai"],
                    keywords: ["dao ham", "y nghia hinh hoc dao ham", "phuong trinh tiep tuyen", "quy tac tinh dao ham", "dao ham ham hop", "dao ham cap hai", "gia toc"],
                    outcomes: {
                        "Nhận biết": "Nhận biết định nghĩa đạo hàm, ý nghĩa hình học (hệ số góc tiếp tuyến) và ý nghĩa vật lý (vận tốc tức thời, gia tốc).",
                        "Thông hiểu": "Tính đạo hàm các hàm số sơ cấp và hàm hợp; viết phương trình tiếp tuyến của đồ thị hàm số tại một điểm.",
                        "Vận dụng": "Giải các bài toán chuyển động biến đổi, tìm vận tốc và gia tốc tức thời trong Vật lý."
                    }
                }
            ],
            topicsExtend: [
                { id: "cd1", name: "Chuyên đề 1: Một số nội dung về vẽ kĩ thuật", outcomes: { "Vận dụng": "Vẽ hình chiếu vuông góc và hình chiếu trục đo của vật thể." } },
                { id: "cd2", name: "Chuyên đề 2: Phép biến hình trong mặt phẳng", outcomes: { "Vận dụng": "Ứng dụng phép tịnh tiến, phép quay, phép vị tự trong thiết kế hoa văn." } },
                { id: "cd3", name: "Chuyên đề 3: Lý thuyết đồ thị", outcomes: { "Vận dụng": "Ứng dụng lý thuyết đồ thị giải bài toán đường đi Euler, Hamilton, tìm đường đi ngắn nhất." } }
            ]
        },

        "12": {
            gradeName: "Toán Lớp 12",
            chapters: [
                {
                    id: "c1", name: "Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số", volume: "Tập 1",
                    lessons: [
                        "Bài 1: Tính đơn điệu và cực trị của hàm số", "Bài 2: Giá trị lớn nhất, nhỏ nhất của hàm số",
                        "Bài 3: Đường tiệm cận của đồ thị hàm số", "Bài 4: Khảo sát và vẽ đồ thị hàm số"
                    ],
                    keywords: ["don dieu", "dong bien", "nghich bien", "cuc tri", "cuc dai", "cuc tieu", "gtln", "gtnn", "tiem can dung", "tiem can ngang", "tiem can xien", "khao sat ham so", "bang bien thien", "do thi"],
                    outcomes: {
                        "Nhận biết": "Nhận biết tính đơn điệu, cực trị, giá trị lớn nhất/nhỏ nhất, tiệm cận đứng, tiệm cận ngang, tiệm cận xiên và tâm đối xứng, trục đối xứng của đồ thị.",
                        "Thông hiểu": "Lập bảng biến thiên và khảo sát hoàn chỉnh các hàm số bậc ba, nhất biến, phân thức hữu tỉ (2/1); biện luận số nghiệm phương trình.",
                        "Vận dụng": "Giải quyết các bài toán tối ưu hóa trong kinh tế, kỹ thuật (chi phí thấp nhất, lợi nhuận lớn nhất, thể tích cực đại)."
                    }
                },
                {
                    id: "c2", name: "Chương II: Vectơ và hệ toạ độ trong không gian", volume: "Tập 1",
                    lessons: ["Bài 5: Vectơ trong không gian", "Bài 6: Hệ trục toạ độ Oxyz trong không gian"],
                    keywords: ["vecto trong khong gian", "he truc toa do oxyz", "toa do diem", "toa do vecto", "tich vo huong oxyz", "do dai vecto", "khoang cach 2 diem"],
                    outcomes: {
                        "Nhận biết": "Nhận biết các phép toán vectơ trong không gian, hệ trục tọa độ $Oxyz$, tọa độ điểm và tọa độ vectơ.",
                        "Thông hiểu": "Tính độ dài vectơ, khoảng cách giữa hai điểm, tích vô hướng và góc giữa hai vectơ trong không gian $Oxyz$.",
                        "Vận dụng": "Gắn hệ trục tọa độ $Oxyz$ vào các mô hình hình học không gian và các bài toán thực tiễn vị trí."
                    }
                },
                {
                    id: "c3", name: "Chương III: Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm", volume: "Tập 1",
                    lessons: [
                        "Bài 7: Khoảng biến thiên và khoảng tứ phân vị của mẫu số liệu ghép nhóm",
                        "Bài 8: Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm"
                    ],
                    keywords: ["khoang bien thien ghep nhom", "khoang tu phan vi ghep nhom", "phuong sai ghep nhom", "do lech chuan ghep nhom", "muc do phan tan"],
                    outcomes: {
                        "Nhận biết": "Nhận biết công thức tính khoảng biến thiên, khoảng tứ phân vị, phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm.",
                        "Thông hiểu": "Tính các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm.",
                        "Vận dụng": "Đánh giá, so sánh độ rủi ro, mức độ đồng đều và độ phân tán của các tập dữ liệu trong thực tế kinh tế, xã hội."
                    }
                },
                {
                    id: "c4", name: "Chương IV: Nguyên hàm và tích phân", volume: "Tập 2",
                    lessons: [
                        "Bài 9: Khái niệm nguyên hàm", "Bài 10: Khái niệm tích phân", "Bài 11: Ứng dụng hình học của tích phân"
                    ],
                    keywords: ["nguyen ham", "bang nguyen ham", "tich phan", "tinh chat tich phan", "dien tich hinh phang", "the tich khoi tron xoay"],
                    outcomes: {
                        "Nhận biết": "Nhận biết khái niệm nguyên hàm, bảng nguyên hàm cơ bản, định nghĩa và tính chất của tích phân.",
                        "Thông hiểu": "Tính nguyên hàm, tích phân bằng phương pháp đổi biến số và từng phần; tính diện tích hình phẳng, thể tích khối tròn xoay.",
                        "Vận dụng": "Tính quãng đường chuyển động từ hàm vận tốc, tính thể tích và công trong kỹ thuật, đời sống."
                    }
                },
                {
                    id: "c5", name: "Chương V: Phương pháp toạ độ trong không gian", volume: "Tập 2",
                    lessons: [
                        "Bài 12: Phương trình mặt phẳng", "Bài 13: Phương trình đường thẳng trong không gian", "Bài 14: Phương trình mặt cầu"
                    ],
                    keywords: ["phuong trinh mat phang", "vecto phap tuyen", "phuong trinh duong thang trong khong gian", "vecto chi phuong", "phuong trinh mat cau", "khoang cach tu diem den mat phang", "vi tri tuong doi oxyz"],
                    outcomes: {
                        "Nhận biết": "Nhận biết phương trình mặt phẳng, phương trình đường thẳng, phương trình mặt cầu trong không gian $Oxyz$.",
                        "Thông hiểu": "Viết phương trình mặt phẳng, đường thẳng, mặt cầu; tính góc, khoảng cách và xét vị trí tương đối giữa chúng.",
                        "Vận dụng": "Giải các bài toán hình học không gian phức tạp và bài toán định vị không gian 3D thực tế (GPS, quỹ đạo bay)."
                    }
                },
                {
                    id: "c6", name: "Chương VI: Xác suất (Xác suất có điều kiện)", volume: "Tập 2",
                    lessons: ["Bài 15: Xác suất có điều kiện", "Bài 16: Công thức xác suất toàn phần và công thức Bayes"],
                    keywords: ["xac suat co dieu kien", "so do hinh cay", "cong thuc xac suat toan phan", "cong thuc bayes"],
                    outcomes: {
                        "Nhận biết": "Nhận biết khái niệm xác suất có điều kiện $P(A|B)$, công thức xác suất toàn phần và công thức Bayes.",
                        "Thông hiểu": "Sử dụng sơ đồ hình cây tính xác suất có điều kiện; áp dụng công thức xác suất toàn phần và công thức Bayes.",
                        "Vận dụng": "Giải các bài toán xác suất chuẩn đoán y khoa, kiểm định chất lượng sản phẩm và phân tích rủi ro kinh doanh."
                    }
                }
            ],
            topicsExtend: [
                { id: "cd1", name: "Chuyên đề 1: Ứng dụng toán học giải quyết một số vấn đề thực tiễn", outcomes: { "Vận dụng": "Mô hình hóa các bài toán tăng trưởng, cân bằng và tối ưu thực tế." } },
                { id: "cd2", name: "Chuyên đề 2: Ứng dụng toán học trong kinh tế - tài chính", outcomes: { "Vận dụng": "Tính toán lãi suất vay, niên kim, giá trị hiện tại và đầu tư tài chính." } },
                { id: "cd3", name: "Chuyên đề 3: Mô hình hoá toán học (Tối ưu hóa, Quy hoạch)", outcomes: { "Vận dụng": "Xây dựng mô hình toán tối ưu hóa chi phí, nhân lực và quy hoạch sản xuất." } }
            ]
        }
    };

    // =========================================================================
    // 2. THUẬT TOÁN NỘI SUY NHẬN DIỆN MA TRẬN & BẢNG ĐẶC TẢ CHUẨN CV 7991
    // =========================================================================
    function removeVietnameseTonesLocal(str) {
        if (!str) return '';
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    }

    // Bộ quy tắc Regex & Trọng số chuyên sâu cho từng chương Toán
    const MATH_SPECIALIZED_RULES = {
        "12": [
            {
                id: "c1", // Đạo hàm & Đồ thị
                regexList: [
                    /f\s*'\s*\(|y\s*'\s*=|y\s*''|tiem\s*can|don\s*dieu|dong\s*bien|nghich\s*bien|cuc\s*tri|cuc\s*dai|cuc\s*tieu|gtln|gtnn|gia\s*tri\s*lon\s*nhat|gia\s*tri\s*nho\s*nhat|bang\s*bien\s*thien|do\s*thi\s*ham\s*so|khao\s*sat|tam\s*doi\s*xung|truc\s*doi\s*xung|nhat\s*bien|bac\s*ba|phan\s*thuc/i,
                    /toi\s*uu|chi\s*phi\s*thap\s*nhat|loi\s*nhuan\s*lon\s*nhat|the\s*tich\s*lon\s*nhat|dien\s*tich\s*nho\s*nhat/i
                ],
                subOutcomes: {
                    tiemcan: {
                        pattern: /tiem\s*can/i,
                        outcomes: {
                            "Nhận biết": "Nhận biết được đường tiệm cận đứng, tiệm cận ngang và tiệm cận xiên từ bảng biến thiên hoặc đồ thị.",
                            "Thông hiểu": "Tìm được phương trình các đường tiệm cận đứng, ngang, xiên của đồ thị hàm số phân thức hữu tỉ.",
                            "Vận dụng": "Biện luận số đường tiệm cận hoặc tìm tham số $m$ thỏa mãn điều kiện về tiệm cận của đồ thị hàm số."
                        }
                    },
                    gtln: {
                        pattern: /gtln|gtnn|lon\s*nhat|nho\s*nhat|toi\s*uu/i,
                        outcomes: {
                            "Nhận biết": "Đọc và xác định được giá trị lớn nhất, giá trị nhỏ nhất của hàm số trên đoạn qua bảng biến thiên hoặc đồ thị.",
                            "Thông hiểu": "Tính được giá trị lớn nhất, giá trị nhỏ nhất của hàm số trên một đoạn hoặc khoảng cho trước.",
                            "Vận dụng": "Vận dụng GTLN, GTNN giải bài toán thực tế tối ưu hóa chi phí, lợi nhuận, diện tích, thể tích."
                        }
                    },
                    dondieu: {
                        pattern: /don\s*dieu|dong\s*bien|nghich\s*bien|cuc\s*tri|cuc\s*dai|cuc\s*tieu/i,
                        outcomes: {
                            "Nhận biết": "Nhận biết khoảng đồng biến, nghịch biến và các điểm cực trị của hàm số thông qua đồ thị hoặc bảng biến thiên.",
                            "Thông hiểu": "Xét tính đơn điệu và tìm các điểm cực trị của hàm số bậc ba, hàm phân thức bậc nhất/bậc nhất, bậc hai/bậc nhất.",
                            "Vận dụng": "Tìm điều kiện của tham số $m$ để hàm số đơn điệu hoặc có cực trị thỏa mãn điều kiện cho trước."
                        }
                    }
                }
            },
            {
                id: "c2", // Vectơ & Hệ tọa độ Oxyz cơ bản
                regexList: [
                    /he\s*toa\s*do\s*oxyz|tich\s*vo\s*huong|toa\s*do\s*vecto|toa\s*do\s*diem|do\s*dai\s*vecto|khoang\s*cach\s*giua\s*hai\s*diem|vecto\s*trong\s*khong\s*gian|trong\s*tam\s*tu\s*dien/i,
                    /\\vec\{|\\overrightarrow/i
                ]
            },
            {
                id: "c3", // Thống kê ghép nhóm
                regexList: [
                    /ghep\s*nhom|khoang\s*bien\s*thien|khoang\s*tu\s*phan\s*vi|phuong\s*sai|do\s*lech\s*chuan|mau\s*so\s*lieu\s*ghep\s*nhom|muc\s*do\s*phan\s*tan/i,
                    /s\^2|q_1|q_3|tu\s*phan\s*vi\s*thu\s*nhat|tu\s*phan\s*vi\s*thu\s*ba/i
                ]
            },
            {
                id: "c4", // Nguyên hàm & Tích phân
                regexList: [
                    /\\int|nguyen\s*ham|tich\s*phan|dien\s*tich\s*hinh\s*phang|the\s*tich\s*khoi\s*tron\s*xoay|tron\s*xoay|f\(x\)\s*dx/i,
                    /quang\s*duong\s*chuyen\s*dong|van\s*toc\s*v\(t\)|gia\s*toc\s*a\(t\)/i
                ],
                subOutcomes: {
                    ungdung: {
                        pattern: /dien\s*tich|the\s*tich|tron\s*xoay|quang\s*duong/i,
                        outcomes: {
                            "Nhận biết": "Nhận biết công thức tính diện tích hình phẳng giới hạn bởi các đường cong và thể tích khối tròn xoay.",
                            "Thông hiểu": "Tính diện tích hình phẳng và thể tích khối tròn xoay tạo thành khi quay quanh trục $Ox$.",
                            "Vận dụng": "Ứng dụng tích phân tính diện tích mảnh đất, thể tích bồn chứa nước, công và quãng đường chuyển động thực tế."
                        }
                    },
                    tichphan: {
                        pattern: /tich\s*phan|\\int_/i,
                        outcomes: {
                            "Nhận biết": "Nhận biết khái niệm, tính chất cơ bản của tích phân xác định.",
                            "Thông hiểu": "Tính tích phân bằng phương pháp đổi biến số và tích phân từng phần cơ bản.",
                            "Vận dụng": "Giải các bài toán tích phân hàm ẩn hoặc tích phân chứa tham số."
                        }
                    }
                }
            },
            {
                id: "c5", // Phương pháp tọa độ Oxyz (Mặt phẳng, Đường thẳng, Mặt cầu)
                regexList: [
                    /mat\s*phang|duong\s*thang|mat\s*cau|vecto\s*phap\s*tuyen|vecto\s*chi\s*phuong|khoang\s*cach\s*tu\s*diem\s*den\s*mat\s*phang|tam\s*mat\s*cau|ban\s*kinh\s*mat\s*cau|vi\s*tri\s*tuong\s*doi/i,
                    /\(x-a\)\^2|\(y-b\)\^2|\(z-c\)\^2|ax\s*\+\s*by\s*\+\s*cz/i
                ],
                subOutcomes: {
                    matcau: {
                        pattern: /mat\s*cau|tam.*ban\s*kinh/i,
                        outcomes: {
                            "Nhận biết": "Nhận biết phương trình mặt cầu, xác định tọa độ tâm $I$ và bán kính $R$ của mặt cầu.",
                            "Thông hiểu": "Viết phương trình mặt cầu đi qua điểm, có tâm và tiếp xúc mặt phẳng hoặc nhận đoạn thẳng làm đường kính.",
                            "Vận dụng": "Giải bài toán tương giao giữa mặt phẳng và mặt cầu, bài toán cực trị tọa độ không gian."
                        }
                    },
                    duongthang: {
                        pattern: /duong\s*thang|vecto\s*chi\s*phuong/i,
                        outcomes: {
                            "Nhận biết": "Nhận biết vectơ chỉ phương, phương trình tham số và chính tắc của đường thẳng trong không gian.",
                            "Thông hiểu": "Viết phương trình đường thẳng đi qua điểm và song song/vuông góc; xét vị trí tương đối giữa hai đường thẳng.",
                            "Vận dụng": "Tìm hình chiếu của điểm lên đường thẳng, khoảng cách giữa hai đường thẳng chéo nhau trong không gian."
                        }
                    },
                    matphang: {
                        pattern: /mat\s*phang|vecto\s*phap\s*tuyen/i,
                        outcomes: {
                            "Nhận biết": "Nhận biết vectơ pháp tuyến và phương trình tổng quát của mặt phẳng trong không gian.",
                            "Thông hiểu": "Viết phương trình mặt phẳng đi qua 1 điểm và vuông góc đường thẳng hoặc đi qua 3 điểm không thẳng hàng.",
                            "Vận dụng": "Tính khoảng cách từ điểm đến mặt phẳng, góc giữa hai mặt phẳng và vị trí tương đối trong mô hình không gian 3D."
                        }
                    }
                }
            },
            {
                id: "c6", // Xác suất có điều kiện & Bayes
                regexList: [
                    /xac\s*suat\s*co\s*dieu\s*kien|p\(a\|b\)|p\(b\|a\)|xac\s*suat\s*toan\s*phan|cong\s*thuc\s*bayes|so\s*do\s*cay|xet\s*nghiem|chuan\s*doan/i
                ],
                subOutcomes: {
                    bayes: {
                        pattern: /bayes|toan\s*phan|xet\s*nghiem/i,
                        outcomes: {
                            "Nhận biết": "Nhận biết công thức xác suất toàn phần và công thức Bayes.",
                            "Thông hiểu": "Vẽ sơ đồ cây và tính xác suất hậu nghiệm bằng công thức Bayes trong các bài toán chẩn đoán y tế.",
                            "Vận dụng": "Ứng dụng công thức Bayes vào đánh giá rủi ro tài chính, kiểm định sản phẩm lỗi và ra quyết định thực tế."
                        }
                    }
                }
            }
        ],
        "11": [
            { id: "c1", regexList: [/\\sin|\\cos|\\tan|\\cot|luong\s*giac|goc\s*luong\s*giac|cong\s*thuc\s*cong|nhan\s*doi/i] },
            { id: "c2", regexList: [/day\s*so|cap\s*so\s*cong|cap\s*so\s*nhan|cong\s*sai|cong\s*boi|u_n|s_n/i] },
            { id: "c3", regexList: [/ghep\s*nhom|trung\s*vi.*ghep\s*nhom|tu\s*phan\s*vi.*ghep\s*nhom|mot.*ghep\s*nhom/i] },
            { id: "c4", regexList: [/song\s*song.*khong\s*gian|hai\s*mat\s*phang\s*song\s*song|cheo\s*nhau|giao\s*tuyen|thiet\s*dien/i] },
            { id: "c5", regexList: [/\\lim|gioi\s*han|lien\s*tuc/i] },
            { id: "c6", regexList: [/\\log|\\ln|luy\s*thua|ham\s*so\s*mu|ham\s*so\s*logarit|a\^x/i] },
            { id: "c7", regexList: [/vuong\s*goc.*khong\s*gian|hai\s*mat\s*phang\s*vuong\s*goc|goc\s*nhi\s*dien|the\s*tich\s*khoi\s*chop|the\s*tich\s*lang\s*tru/i] },
            { id: "c8", regexList: [/xac\s*suat|bien\s*co\s*hop|bien\s*co\s*giao|xung\s*khac|doc\s*lap/i] },
            { id: "c9", regexList: [/dao\s*ham|tiep\s*tuyen|van\s*toc\s*tuc\s*thoi|gia\s*toc/i] }
        ],
        "10": [
            { id: "c1", regexList: [/menh\s*de|tap\s*hop|\\in|\\subset|\\cap|\\cup|\\backslash/i] },
            { id: "c2", regexList: [/bat\s*phuong\s*trinh\s*bac\s*nhat\s*hai\s*an|mien\s*nghiem|quy\s*hoach\s*tuyen\s*tinh/i] },
            { id: "c3", regexList: [/dinh\s*li\s*cosin|dinh\s*li\s*sin|heron|giai\s*tam\s*giac|he\s*thuc\s*luong/i] },
            { id: "c4", regexList: [/vecto|tich\s*vo\s*huong|quy\s*tac\s*hinh\s*binh\s*hanh|quy\s*tac\s*3\s*diem/i] },
            { id: "c5", regexList: [/so\s*gan\s*dung|sai\s*so|trung\s*binh|trung\s*vi|tu\s*phan\s*vi|do\s*lech\s*chuan/i] },
            { id: "c6", regexList: [/ham\s*so\s*bac\s*hai|parabol|tam\s*thuc\s*bac\s*hai|phuong\s*trinh\s*chua\s*can/i] },
            { id: "c7", regexList: [/oxy|phuong\s*trinh\s*duong\s*thang|phuong\s*trinh\s*duong\s*tron|elip|hyperbol/i] },
            { id: "c8", regexList: [/hoan\s*vi|chinh\s*hop|to\s*hop|nhi\s*thuc\s*newton|quy\s*tac\s*dem/i] },
            { id: "c9", regexList: [/xac\s*suat\s*co\s*dien|khong\s*gian\s*mau|bien\s*co\s*doi/i] }
        ]
    };

    function interpolateMathCV7991(data, gradeInput = '12', subjectInput = 'Toán', manualOverrides = null) {
        let cleanGrade = String(gradeInput).replace(/\D/g, '') || '12';
        if (!MATH_CURRICULUM_KNTT[cleanGrade]) cleanGrade = '12';

        let curriculum = MATH_CURRICULUM_KNTT[cleanGrade];
        let r1 = data.round1 || [];
        let r2 = data.round2 || [];
        let r3 = data.round3 || [];
        let totalQ = r1.length + r2.length + r3.length;

        let detectedChapters = {};
        let specializedRules = MATH_SPECIALIZED_RULES[cleanGrade] || [];

        // Khởi tạo các chương từ giáo trình
        curriculum.chapters.forEach(ch => {
            detectedChapters[ch.id] = {
                id: ch.id,
                name: ch.name,
                volume: ch.volume,
                r1: [],
                r2: [],
                r3: [],
                levels: { 'Nhận biết': 0, 'Thông hiểu': 0, 'Vận dụng': 0 },
                outcomes: { ...(ch.outcomes || {}) },
                detailedOutcomes: {}
            };
        });

        // Hàm phân tích 1 câu hỏi
        function classifyQuestion(q, roundType, qIndex) {
            let qKey = `${roundType}_${qIndex}`;
            let override = (manualOverrides && manualOverrides[qKey]) || (q._cv7991Override);

            let rawText = String(q.text || '') + ' ' + String(q.explanation || '');
            let fullText = removeVietnameseTonesLocal(rawText).toLowerCase();
            let matchedChapterId = null;
            let matchedSubOutcome = null;

            // 1. Kiểm tra nếu có ghi đè thủ công (manual override từ giáo viên)
            if (override && override.chapterId && detectedChapters[override.chapterId]) {
                matchedChapterId = override.chapterId;
            }

            // 2. Kiểm tra nếu câu hỏi có sẵn thuộc tính topic/chapter/chuDe khớp tên chương
            if (!matchedChapterId && (q.topic || q.chapter || q.chuDe || q.category)) {
                let qTopicClean = removeVietnameseTonesLocal(String(q.topic || q.chapter || q.chuDe || q.category)).toLowerCase();
                for (let ch of curriculum.chapters) {
                    let chNameClean = removeVietnameseTonesLocal(ch.name).toLowerCase();
                    if (qTopicClean.includes(chNameClean) || chNameClean.includes(qTopicClean) || qTopicClean.includes(ch.id)) {
                        matchedChapterId = ch.id;
                        break;
                    }
                }
            }

            // 3. Sử dụng hệ thống Luật chuyên sâu (Specialized Rules & Regex)
            if (!matchedChapterId && specializedRules.length > 0) {
                let bestRuleScore = -1;
                specializedRules.forEach(rule => {
                    let ruleScore = 0;
                    rule.regexList.forEach(rx => {
                        if (rx.test(rawText) || rx.test(fullText)) {
                            ruleScore += 10;
                        }
                    });

                    // Kiểm tra chi tiết subOutcomes nếu có
                    if (rule.subOutcomes) {
                        Object.values(rule.subOutcomes).forEach(sub => {
                            if (sub.pattern && (sub.pattern.test(rawText) || sub.pattern.test(fullText))) {
                                ruleScore += 8;
                                if (!matchedSubOutcome || ruleScore > bestRuleScore) {
                                    matchedSubOutcome = sub.outcomes;
                                }
                            }
                        });
                    }

                    if (ruleScore > bestRuleScore && ruleScore > 0) {
                        bestRuleScore = ruleScore;
                        matchedChapterId = rule.id;
                    }
                });
            }

            // 4. Nội suy theo từ khóa đặc trưng (Keywords weighted score)
            if (!matchedChapterId) {
                let maxScore = -1;
                curriculum.chapters.forEach(ch => {
                    let score = 0;
                    (ch.keywords || []).forEach(kw => {
                        let cleanKw = removeVietnameseTonesLocal(kw).toLowerCase();
                        if (fullText.includes(cleanKw)) {
                            score += cleanKw.length >= 8 ? 5 : cleanKw.length >= 4 ? 3 : 1;
                        }
                    });
                    if (score > maxScore && score > 0) {
                        maxScore = score;
                        matchedChapterId = ch.id;
                    }
                });
            }

            // 5. Fallback thông minh theo phân phối nếu hoàn toàn không có từ khóa
            if (!matchedChapterId) {
                let totalChapters = curriculum.chapters.length || 1;
                // Phân bổ đều theo chỉ số câu hỏi thay vì dồn tất cả vào chương 1
                let fallbackIdx = Math.min(totalChapters - 1, Math.floor((qIndex / Math.max(1, (r1.length || 12))) * totalChapters));
                matchedChapterId = curriculum.chapters[fallbackIdx]?.id || curriculum.chapters[0].id;
            }

            // 6. Phân loại mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng)
            let level = 'Thông hiểu';
            if (override && override.level && ['Nhận biết', 'Thông hiểu', 'Vận dụng'].includes(override.level)) {
                level = override.level;
            } else if (q.level || q.mucDo || q.levelName) {
                let lClean = removeVietnameseTonesLocal(String(q.level || q.mucDo || q.levelName)).toLowerCase();
                if (lClean.includes('nhan') || lClean.includes('biet') || lClean.includes('1') || lClean === 'nb') {
                    level = 'Nhận biết';
                } else if (lClean.includes('van') || lClean.includes('vd') || lClean.includes('3') || lClean.includes('cao')) {
                    level = 'Vận dụng';
                } else {
                    level = 'Thông hiểu';
                }
            } else {
                // Nhận diện theo từ khóa hành động và độ phức tạp
                let isRecognition = /khang\s*dinh\s*nao\s*dung|khang\s*dinh\s*nao\s*sai|menh\s*de\s*nao\s*dung|cong\s*thuc\s*nao|tap\s*xac\s*dinh|toa\s*do\s*cua|tiem\s*can\s*dung|tiem\s*can\s*ngang|dao\s*ham\s*cua\s*ham\s*so.*la|nguyen\s*ham\s*cua\s*ham\s*so.*la|vecto\s*nao\s*duoi\s*day|tam\s*cua\s*mat\s*cau|ban\s*kinh\s*cua\s*mat\s*cau/i.test(fullText);
                let isApplication = /thuc\s*te|thuc\s*tien|chi\s*phi|loi\s*nhuan|doanh\s*thu|quy\s*dao|toi\s*uu|chieu\s*cao|quang\s*duong|xac\s*suat\s*co\s*dieu\s*kien|tham\s*so\s*m.*thoa\s*man|co\s*bao\s*nhieu\s*gia\s*tri\s*nguyen\s*cua\s*m/i.test(fullText);

                if (isApplication) {
                    level = 'Vận dụng';
                } else if (isRecognition) {
                    level = 'Nhận biết';
                } else {
                    if (roundType === 'round1') {
                        if (qIndex < 6) level = 'Nhận biết';
                        else if (qIndex < 10) level = 'Thông hiểu';
                        else level = 'Vận dụng';
                    } else if (roundType === 'round2') {
                        level = (qIndex < 2) ? 'Thông hiểu' : 'Vận dụng';
                    } else if (roundType === 'round3') {
                        level = (qIndex < 2) ? 'Thông hiểu' : 'Vận dụng';
                    }
                }
            }

            let entry = detectedChapters[matchedChapterId];
            entry.levels[level] = (entry.levels[level] || 0) + 1;

            if (matchedSubOutcome && matchedSubOutcome[level]) {
                entry.outcomes[level] = matchedSubOutcome[level];
            }

            let qInfo = { 
                q, 
                qKey,
                qNum: qIndex + 1, 
                level, 
                chapterId: matchedChapterId, 
                chapterName: entry.name 
            };

            if (roundType === 'round1') entry.r1.push(qInfo);
            else if (roundType === 'round2') entry.r2.push(qInfo);
            else if (roundType === 'round3') entry.r3.push(qInfo);

            return qInfo;
        }

        let classifiedQuestions = {
            round1: r1.map((q, idx) => classifyQuestion(q, 'round1', idx)),
            round2: r2.map((q, idx) => classifyQuestion(q, 'round2', idx)),
            round3: r3.map((q, idx) => classifyQuestion(q, 'round3', idx))
        };

        // Lọc các chương có câu hỏi xuất hiện
        let activeChapters = Object.values(detectedChapters).filter(ch => (ch.r1.length + ch.r2.length + ch.r3.length) > 0);
        if (activeChapters.length === 0 && curriculum.chapters.length > 0) {
            activeChapters = [detectedChapters[curriculum.chapters[0].id]];
        }

        return {
            grade: cleanGrade,
            gradeName: curriculum.gradeName,
            allChapters: curriculum.chapters,
            activeChapters,
            classifiedQuestions,
            totalQ
        };
    }

    // =========================================================================
    // 3. THUẬT TOÁN SINH VÀ TRỘN ĐA MÃ ĐỀ (2 ĐẾN 12 MÃ ĐỀ)
    // =========================================================================
    function shuffleArray(arr) {
        let res = [...arr];
        for (let i = res.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [res[i], res[j]] = [res[j], res[i]];
        }
        return res;
    }

    function generateMultiExamCodes(originalData, numCodes = 4, baseCode = '101', options = {}) {
        let count = Math.max(1, Math.min(12, parseInt(numCodes) || 4));
        let baseNum = parseInt(baseCode) || 101;
        let shuffleOptionsPartI = options.shuffleOptionsPartI !== false; // Mặc định là trộn đáp án A, B, C, D

        let generatedExams = [];

        for (let c = 0; c < count; c++) {
            let codeStr = (baseNum + c).toString();
            
            // Nếu là mã đề đầu tiên (c === 0) và không yêu cầu xáo mã gốc thì giữ nguyên thứ tự
            let isOriginalOrder = (c === 0 && count === 1);

            let newRound1 = [];
            let newRound2 = [];
            let newRound3 = [];

            // 1. Phần I: Trắc nghiệm 4 lựa chọn
            let r1Pool = (originalData.round1 || []).map((q, idx) => ({ ...q, originalNum: idx + 1 }));
            if (!isOriginalOrder && count > 1) {
                r1Pool = shuffleArray(r1Pool);
            }

            r1Pool.forEach((q, newIdx) => {
                let opts = [...(q.options || ["", "", "", ""])];
                let originalAnswer = String(q.answer || '').trim();

                // Xác định nội dung chính xác của phương án đúng ban đầu
                let correctText = '';
                if (['A', 'B', 'C', 'D'].includes(originalAnswer.toUpperCase())) {
                    let letterIdx = ['A', 'B', 'C', 'D'].indexOf(originalAnswer.toUpperCase());
                    correctText = opts[letterIdx] !== undefined ? opts[letterIdx] : opts[0];
                } else {
                    correctText = originalAnswer;
                }

                let finalOpts = [...opts];
                let newAnswerLetter = 'A';

                if (shuffleOptionsPartI && !isOriginalOrder && count > 1) {
                    finalOpts = shuffleArray(opts);
                }

                // Tìm lại vị trí mới của đáp án đúng sau khi trộn
                let newLetterIdx = finalOpts.findIndex(o => String(o).trim() === String(correctText).trim());
                if (newLetterIdx !== -1) {
                    newAnswerLetter = ['A', 'B', 'C', 'D'][newLetterIdx];
                } else {
                    newAnswerLetter = 'A';
                }

                newRound1.push({
                    ...q,
                    id: newIdx + 1,
                    options: finalOpts,
                    answer: newAnswerLetter,
                    correctText: correctText,
                    originalNum: q.originalNum
                });
            });

            // 2. Phần II: Đúng / Sai (Chỉ trộn thứ tự câu)
            let r2Pool = (originalData.round2 || []).map((q, idx) => ({ ...q, originalNum: idx + 1 }));
            if (!isOriginalOrder && count > 1) {
                r2Pool = shuffleArray(r2Pool);
            }
            r2Pool.forEach((q, newIdx) => {
                newRound2.push({
                    ...q,
                    id: newIdx + 1,
                    originalNum: q.originalNum
                });
            });

            // 3. Phần III: Trả lời ngắn (Chỉ trộn thứ tự câu)
            let r3Pool = (originalData.round3 || []).map((q, idx) => ({ ...q, originalNum: idx + 1 }));
            if (!isOriginalOrder && count > 1) {
                r3Pool = shuffleArray(r3Pool);
            }
            r3Pool.forEach((q, newIdx) => {
                newRound3.push({
                    ...q,
                    id: newIdx + 1,
                    originalNum: q.originalNum
                });
            });

            generatedExams.push({
                code: codeStr,
                data: {
                    round1: newRound1,
                    round2: newRound2,
                    round3: newRound3
                }
            });
        }

        return generatedExams;
    }

    // =========================================================================
    // 4. SINH BẢNG ĐÁP ÁN TỔNG HỢP CHO TẤT CẢ CÁC MÃ ĐỀ (MATRIX ANSWER SHEET)
    // =========================================================================
    function generateMultiExamAnswerMatrixHTML(generatedExams) {
        if (!generatedExams || generatedExams.length === 0) return '';

        let codes = generatedExams.map(e => e.code);
        let maxR1 = Math.max(...generatedExams.map(e => e.data.round1.length));
        let maxR2 = Math.max(...generatedExams.map(e => e.data.round2.length));
        let maxR3 = Math.max(...generatedExams.map(e => e.data.round3.length));

        let html = `
        <div data-cv7991-block="true" data-section="matrix-answers" style="page-break-before: always; margin-top: 20px;">
            <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="font-weight: bold; font-size: 1.1em; text-transform: uppercase; margin: 0 0 4px 0;">BẢNG ĐÁP ÁN TỔNG HỢP CÁC MÃ ĐỀ THI</h2>
                <p style="font-style: italic; font-size: 0.88em; margin: 0; color: #475569;">(Dành cho Giáo viên & Cán bộ chấm thi)</p>
            </div>`;

        // 1. Bảng Đáp Án Phần I (Trắc nghiệm 4 lựa chọn)
        if (maxR1 > 0) {
            html += `
            <div style="margin-bottom: 16px;">
                <h3 style="font-weight: bold; font-size: 0.95em; text-transform: uppercase; margin-bottom: 6px; color: #1e3a8a;">PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN (Mỗi câu đúng 0,25 điểm)</h3>
                <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.85em;" border="1" cellpadding="3" cellspacing="0">
                    <thead>
                        <tr style="background-color: #f1f5f9; font-weight: bold;">
                            <th style="border: 1px solid black; width: 60px;">Câu</th>
                            ${codes.map(c => `<th style="border: 1px solid black; background-color: #e0f2fe; color: #0369a1;">Mã ${c}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>`;
            
            for (let i = 0; i < maxR1; i++) {
                html += `
                        <tr>
                            <td style="border: 1px solid black; font-weight: bold; background-color: #fafafa;">${i + 1}</td>
                            ${generatedExams.map(exam => {
                                let q = exam.data.round1[i];
                                let ans = q ? (q.answer || '-') : '-';
                                return `<td style="border: 1px solid black; font-weight: bold; color: #b91c1c;">${ans}</td>`;
                            }).join('')}
                        </tr>`;
            }

            html += `
                    </tbody>
                </table>
            </div>`;
        }

        // 2. Bảng Đáp Án Phần II (Đúng / Sai)
        if (maxR2 > 0) {
            html += `
            <div style="margin-bottom: 16px;">
                <h3 style="font-weight: bold; font-size: 0.95em; text-transform: uppercase; margin-bottom: 6px; color: #1e3a8a;">PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (Mỗi ý a, b, c, d: 0,1đ - 0,25đ - 0,5đ - 1,0đ)</h3>
                <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.85em;" border="1" cellpadding="3" cellspacing="0">
                    <thead>
                        <tr style="background-color: #f1f5f9; font-weight: bold;">
                            <th style="border: 1px solid black; width: 60px;">Câu</th>
                            <th style="border: 1px solid black; width: 40px;">Ý</th>
                            ${codes.map(c => `<th style="border: 1px solid black; background-color: #fef3c7; color: #92400e;">Mã ${c}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>`;

            for (let i = 0; i < maxR2; i++) {
                ['a', 'b', 'c', 'd'].forEach((lbl, sIdx) => {
                    html += `
                        <tr>
                            ${sIdx === 0 ? `<td style="border: 1px solid black; font-weight: bold; background-color: #fafafa;" rowspan="4"><b>Câu ${i + 1}</b></td>` : ''}
                            <td style="border: 1px solid black; font-weight: bold; color: #475569;">${lbl})</td>
                            ${generatedExams.map(exam => {
                                let q = exam.data.round2[i];
                                let stmt = q && q.statements ? q.statements[sIdx] : null;
                                let isT = stmt ? stmt.isTrue : false;
                                return `<td style="border: 1px solid black; font-weight: bold; color: ${isT ? '#15803d' : '#b91c1c'};">${isT ? 'Đ' : 'S'}</td>`;
                            }).join('')}
                        </tr>`;
                });
            }

            html += `
                    </tbody>
                </table>
            </div>`;
        }

        // 3. Bảng Đáp Án Phần III (Trả lời ngắn)
        if (maxR3 > 0) {
            html += `
            <div style="margin-bottom: 16px;">
                <h3 style="font-weight: bold; font-size: 0.95em; text-transform: uppercase; margin-bottom: 6px; color: #1e3a8a;">PHẦN III: CÂU HỎI TRẢ LỜI NGẮN (Mỗi câu đúng 0,5 điểm)</h3>
                <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.85em;" border="1" cellpadding="3" cellspacing="0">
                    <thead>
                        <tr style="background-color: #f1f5f9; font-weight: bold;">
                            <th style="border: 1px solid black; width: 60px;">Câu</th>
                            ${codes.map(c => `<th style="border: 1px solid black; background-color: #ecfdf5; color: #065f46;">Mã ${c}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>`;

            for (let i = 0; i < maxR3; i++) {
                html += `
                        <tr>
                            <td style="border: 1px solid black; font-weight: bold; background-color: #fafafa;">${i + 1}</td>
                            ${generatedExams.map(exam => {
                                let q = exam.data.round3[i];
                                let ans = q ? (q.answer || '-') : '-';
                                return `<td style="border: 1px solid black; font-weight: bold; color: #047857;">${ans}</td>`;
                            }).join('')}
                        </tr>`;
            }

            html += `
                    </tbody>
                </table>
            </div>`;
        }

        html += `</div>`;
        return html;
    }

    // =========================================================================
    // 4. THUẬT TOÁN TỰ ĐỘNG NHẬN DIỆN CHỦ ĐỀ / BÀI HỌC KNTT CHO CÂU HỎI
    // =========================================================================
    function findBestKNTTTopicForQuestion(text, grade = '12') {
        if (!text || !text.trim()) return `[KNTT] Lớp ${grade || '12'} - Chủ đề chung`;
        let cleanGrade = String(grade || '12').replace(/\D/g, '') || '12';
        let gData = MATH_CURRICULUM_KNTT[cleanGrade] || MATH_CURRICULUM_KNTT['12'];
        if (!gData || !gData.chapters) return `[KNTT] Lớp ${cleanGrade} - Chủ đề chung`;

        let cleanText = removeVietnameseTonesLocal(text).toLowerCase();
        let bestMatch = null;
        let maxScore = 0;

        gData.chapters.forEach(ch => {
            let chScore = 0;

            (ch.keywords || []).forEach(kw => {
                let kwClean = removeVietnameseTonesLocal(kw).toLowerCase();
                if (cleanText.includes(kwClean)) {
                    chScore += (kwClean.length > 8 ? 6 : 4);
                }
            });

            (ch.lessons || []).forEach(ls => {
                let lsTitle = typeof ls === 'string' ? ls : (ls.name || ls.title || '');
                let lsTitleClean = removeVietnameseTonesLocal(lsTitle).toLowerCase();
                let lsScore = chScore;

                // Extract core words in lesson title
                let lsWords = lsTitleClean.replace(/bai\s*\d+[\.:\s]*/i, '').split(/[\s,\.\-]+/).filter(w => w.length > 2);
                lsWords.forEach(w => {
                    if (cleanText.includes(w)) lsScore += 5;
                });

                if (lsScore > maxScore) {
                    maxScore = lsScore;
                    bestMatch = `[KNTT] Lớp ${cleanGrade} - ${lsTitle}`;
                }
            });

            if (chScore > maxScore && !bestMatch) {
                maxScore = chScore;
                bestMatch = `[KNTT] Lớp ${cleanGrade} - ${ch.name}`;
            }
        });

        // Check topicsExtend (Chuyên đề) if available
        if (gData.topicsExtend && Array.isArray(gData.topicsExtend)) {
            gData.topicsExtend.forEach(cd => {
                let cdName = cd.name || '';
                let cdNameClean = removeVietnameseTonesLocal(cdName).toLowerCase();
                let cdWords = cdNameClean.replace(/chuyen de\s*\d+[\.:\s]*/i, '').split(/[\s,\.\-]+/).filter(w => w.length > 2);
                let cdScore = 0;
                cdWords.forEach(w => {
                    if (cleanText.includes(w)) cdScore += 6;
                });
                if (cdScore > maxScore) {
                    maxScore = cdScore;
                    bestMatch = `[KNTT] Lớp ${cleanGrade} - ${cdName}`;
                }
            });
        }

        if (maxScore > 0 && bestMatch) {
            return bestMatch;
        }

        return `[KNTT] Lớp ${cleanGrade} - ${gData.chapters[0]?.name || 'Chủ đề chung'}`;
    }

    // Gán các hàm và dữ liệu ra window toàn cục
    window.MATH_CURRICULUM_KNTT = MATH_CURRICULUM_KNTT;
    window.findBestKNTTTopicForQuestion = findBestKNTTTopicForQuestion;
    window.interpolateMathCV7991 = interpolateMathCV7991;
    window.generateMultiExamCodes = generateMultiExamCodes;
    window.generateMultiExamAnswerMatrixHTML = generateMultiExamAnswerMatrixHTML;

})(window);
