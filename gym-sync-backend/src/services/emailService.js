import nodemailer from "nodemailer";

// Transporter SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Funkcje
export const sendVerifiedAccount = async (to, code) => {
  await transporter.sendMail({
    from: `"RepEvo" <${process.env.SMTP_USER}>`,
    to,
    subject: "Link do weryfikacji konta",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
      <tr>
        <td align="left">
          <p style="font-size: 24px; font-weight: bold;">
            Twój kod to:
          </p>
          <a href="https://repevo.pl/autoryzacja/weryfikacja-konta?token=${code}" style="margin: 0 0 15px 0;">
            Zweryfikuj adres email
          </a>
          <p style="margin: 0;">
            Link jest ważny przez 60 minut.
          </p>

          <div style="height: 1px; background-color: #777; margin: 20px 0;"></div>

          <p style="margin: 0; font-size: 13px; color: #777;">
            Jeśli to nie Ty próbujesz założyć konto, zignoruj tę wiadomość.
          </p>
        </td>
      </tr>
    </table>
      `,
  });
};

export const sendEmailChangeCode = async (to, code) => {
  await transporter.sendMail({
    from: `"RepEvo" <${process.env.SMTP_USER}>`,
    to,
    subject: "Kod zmiany email",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
      <tr>
        <td align="left">
          <p style="font-size: 24px; font-weight: bold;">
            Twój kod to:
          </p>
          <p style="font-size: 36px; font-weight: bold; color: #9e00b3; margin: 0 0 15px 0;">
            ${code}
          </p>
          <p style="margin: 0 0 5px 0;">
            Kod jest ważny przez 10 minut.
          </p>
          <p style="margin: 0;">
            Kod należy wpisać w panelu użytkownika.
          </p>

          <div style="height: 1px; background-color: #777; margin: 20px 0;"></div>

          <p style="margin: 0; font-size: 13px; color: #777;">
            Jeśli to nie Ty próbujesz zmienić adres email, zignoruj tę wiadomość.
          </p>
        </td>
      </tr>
    </table>
      `,
  });
};
