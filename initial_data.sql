-- Insertar productos iniciales desde el código anterior
INSERT INTO products (name, description, price, image_url, category_id) VALUES
('Velvet Rose Blush', 'Pigmento sedoso natural', 34.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqfpkn1Ny0ihm7aJLP10Vd6fcXeyaqdySDsk-Jh2P2Nsg4O2QNmlete4fpBFNWYBbZA51H3Xw1ruyRYKS-_MCY7JjVdioSUyNM8gDhrYYN8VE5SVPKFpiKrPTx8Zuzjw0ERALl_V4IXYsNDEFqu1lfKeoD6b4Lzxac17Oio76cXxN1_kSby8erdSAA4QTx4Ywxb3zSQsiqZrns3ww5JdSoRDniILS4MNDuoBEWf01AuatbVqTtXvPiCROc0lLY2ncOA5cDU5OfExmf', (SELECT id FROM categories WHERE name = 'Rostro')),
('Silk Matte Lip', 'Acabado hidratante 12h', 28.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAit0hWnNd6iiLvFacjVOr5kicIqN0oHw24c49mgdbmx4QnhHkJgW9nAzV6WuRgv5A5HyuixiP7Luzv2mCe4R-cUI7bG3b0r2d9hsbO0BJrClbBCvWvIQ1Y1OZPou6rNbARd6sTx5JGP4Mi92H4acFp4MOFObX-TZsvpnrMB4SwHK4uADyrBT38WC7CRt5Q3uZUryrr71w4wlm7k1tr-76ydhoLtXIuxgg9fsKQRAFBLieHS6abS_Mk2lsT9BR1riJ2u_8nZwPQmKlY', (SELECT id FROM categories WHERE name = 'Labios')),
('Glow Drops', 'Luminosidad interna', 42.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAug1quozrijFs0VRkVtiGysLZxraaOl0uDJBlCqtOvwIRpgmoBa7yJRx2R3OX5PUNem59kVBHA5IsbleinRtwBf4QMgfuqjSzBB39G5MkqEf5zh1FjpiM85otwUG8f1LLEUpj3MduXu94t30_E3O4bxgl-9Q7twp2u44sJhlRRXnDP2jqyrv-ccPVtE0tUAZcLbNrz2wlPxHnlpC71OL5KOsUsrTiajqBChNdbyqU1yMGAthVvDyiiPbzC1x08fKunLWF73XgfDrtv', (SELECT id FROM categories WHERE name = 'Rostro')),
('Duo Contour Kit', 'Esculpe con delicadeza', 45.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo2oIiHrvq_40MhhEHS6BHw9VJnmRgSA29mLT2uO3XpmIbdWQVifhGbx8YQuWzcWSnslgdZBCmNl5GkZtCeDEXkzFwCBvBzYJ9RxhgavKMFl0nB1EaKS_4I0MEwJy8wFgPlI9F3HH6dno0Xb3-M5XAgTP4Rcpt0QnvPCj777QnKOhk4zk9HepsqQ7p78JSZ43FCh1furaP0tsYnPX8P5gj936o0D-u6Erk3qnjdf5lr6XRCkKlx--c3Y5kt1TL9yhj5dSzKxscAC9l', (SELECT id FROM categories WHERE name = 'Accesorios')),
('Essence No. 7', 'Perfume artesanal floral', 85.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCYV-Q3blnjQP2HvoL0Fw-NMA3NQNFpWcVogdgUijLMYgt_mwEQQ-Yb4y0cUp8iUslLrUZJw5bV_Vval5_v4qY1kq31ST3xu5mxgMdJZ2w8kirCh_65b-YR10QqGcxeGZD2uUbi-CZvayFVILOZ4X2qsL3GxU9vXy-eoyXzbWGpbf-thcCj80z2c21Z5J_InmMIqI9AjGd2cCyaE0zJCj_EusuP8tIT8g8SQga-Pbdw8dRc6oOp0_mieCVlQwe8H7amr3gFoVmho7D', (SELECT id FROM categories WHERE name = 'Accesorios')),
('Botanical Elixir', 'Aceite facial revitalizante', 56.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwNKXH2Ci1MtuuJhm0MNKHFHJsolE6qfkpPdKj6I2lNprSq7E8sGWBAD0Qxj3nBdhtgdjnBgl1ctG2iSZvXXQny6nQNs7sVwyIKcoBmSDJOL-dpY66JAXb-YSs5Fx8ifwIy9ekcsvBGxPJFMoVW8SIXqIETRMBo-qw_dW26dgFaBdZSfy6xfxkBl__kv_5ufSq5_m3VSdRF-Xf0732x2Ym258x9w_i3hXH6mRyEJBh2XZ_yq4vaVl7kR0Nr3vn7zx_wMB8bjwxb9oR', (SELECT id FROM categories WHERE name = 'Rostro')),
('Nude Dreams', 'Paleta de 12 tonos cálidos', 48.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2OpfPvr-zqf41jfr0eFUk9kV0dkMphWVys5B5ckK8PeQO1_E2fmYJUgdWzfVz1Rye6bggnwNsQ9uUCuNgHDtXurABhcMaiQpieal1c3yogPZcbeUbZvQT82a0G0ryDJniCwp960zE3drPRFPe15qFI6rX7jSFvs9tXSZK8tAiASqrIBtl4BPEKvsf1Z_UTYKK9o7FJntJpjAdTSuIJbU5Dhro2C1MKYddRRaF-0-vAlw0wMxrHeL1AGqrQeApXhJ-TauWEK9Yi2B9', (SELECT id FROM categories WHERE name = 'Ojos')),
('Cloud Cream', 'Hidratación ligera 24h', 39.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPkQGNFVxlZS6KIFuklhHrxNpHYzDsLmqG7sLW7ZVPs0QfCj5z7EQvROuUC5DdIPgDahD2x86ZQX1ATAjZmOQ3sNkmOZfC8427rJUhkuMnIJ8utpFzImSswIG_zYKGC4SJzcpGM1fnbS3b8a8m0fL2f9bT7kPgefSSKn4rzvnHTpBMsTTvA5P0-N3mvbmgJAvDEqXMzbsf9ZT9IbAwEQuUhmUXikjUFr1Oe37mqFVy3Tgq0dvlVz8Jm2HICTtMeo6HxQjnXu7spWXX', (SELECT id FROM categories WHERE name = 'Rostro'));

-- Insertar algunos combos iniciales
INSERT INTO combos (name, description, price, image_url) VALUES
('Combo Glow Perfecto', 'Paleta de sombras + Labial Velvet + Serum Iluminador', 85.00, 'https://example.com/combo1.jpg'),
('Combo Skincare Essential', 'Aceite facial + Hidratante + Serum Glow', 120.00, 'https://example.com/combo2.jpg'),
('Combo Maquillaje Completo', 'Blush + Labial + Paleta de ojos', 95.00, 'https://example.com/combo3.jpg');

-- Relacionar productos con combos (ejemplo)
-- Combo 1: Velvet Rose Blush + Silk Matte Lip + Glow Drops
INSERT INTO combo_items (combo_id, product_id) VALUES
((SELECT id FROM combos WHERE name = 'Combo Glow Perfecto'), (SELECT id FROM products WHERE name = 'Velvet Rose Blush')),
((SELECT id FROM combos WHERE name = 'Combo Glow Perfecto'), (SELECT id FROM products WHERE name = 'Silk Matte Lip')),
((SELECT id FROM combos WHERE name = 'Combo Glow Perfecto'), (SELECT id FROM products WHERE name = 'Glow Drops'));

-- Combo 2: Botanical Elixir + Cloud Cream + Glow Drops
INSERT INTO combo_items (combo_id, product_id) VALUES
((SELECT id FROM combos WHERE name = 'Combo Skincare Essential'), (SELECT id FROM products WHERE name = 'Botanical Elixir')),
((SELECT id FROM combos WHERE name = 'Combo Skincare Essential'), (SELECT id FROM products WHERE name = 'Cloud Cream')),
((SELECT id FROM combos WHERE name = 'Combo Skincare Essential'), (SELECT id FROM products WHERE name = 'Glow Drops'));

-- Combo 3: Velvet Rose Blush + Silk Matte Lip + Nude Dreams
INSERT INTO combo_items (combo_id, product_id) VALUES
((SELECT id FROM combos WHERE name = 'Combo Maquillaje Completo'), (SELECT id FROM products WHERE name = 'Velvet Rose Blush')),
((SELECT id FROM combos WHERE name = 'Combo Maquillaje Completo'), (SELECT id FROM products WHERE name = 'Silk Matte Lip')),
((SELECT id FROM combos WHERE name = 'Combo Maquillaje Completo'), (SELECT id FROM products WHERE name = 'Nude Dreams'));