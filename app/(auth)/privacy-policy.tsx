import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import Heading from '@/ui/components/Heading';
import Text from '@/ui/components/Text';
import { getColor } from '@/ui/utils/getColor';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: getColor('background'),
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    width: '100%',
    backgroundColor: getColor('border'),
    marginTop: 20,
    marginBottom: 20,
  },
  listItem: {
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 2,
  },
  link: {
    color: getColor('primary'),
    textDecorationLine: 'underline',
  },
  summary: {
    marginBottom: 30,
  },
});

export default function PrivacyPolicyScreen() {
  const handleMailto = async (email: string) => {
    const url = `mailto:${email}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handlePhone = async (number: string) => {
    const url = `tel:${number}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleExternalLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
      <Heading text="Polityka prywatności" />
      <Text style={styles.heading}>1. Administrator Danych</Text>
      <Text>
        Administratorem danych osobowych użytkowników aplikacji "Gdzie jest kosz" jest Patryk
        Bernasiewicz. W razie jakichkolwiek pytań dotyczących przetwarzania danych osobowych,
        prosimy o kontakt pod adresem e-mail:{' '}
        <Text style={styles.link} onPress={() => handleMailto('patryk.bernasiewicz@gmail.com')}>
          patryk.bernasiewicz@gmail.com
        </Text>{' '}
        lub telefonicznie:{' '}
        <Text style={styles.link} onPress={() => handlePhone('+48514773604')}>
          +48&nbsp;514&nbsp;773&nbsp;604
        </Text>
        .
      </Text>
      <Text style={styles.heading}>2. Dane kontaktowe</Text>
      <Text>
        W sprawach związanych z ochroną danych osobowych, realizacją praw wynikających z RODO (np.
        prawo do usunięcia danych, prawo do dostępu do danych), prosimy o kontakt pod adresem
        e-mail:{' '}
        <Text style={styles.link} onPress={() => handleMailto('patryk.bernasiewicz@gmail.com')}>
          patryk.bernasiewicz@gmail.com
        </Text>
      </Text>
      <Text style={styles.heading}>3. Nazwa aplikacji</Text>
      <Text>
        Polityka Prywatności dotyczy aplikacji mobilnej oraz internetowej o nazwie "Gdzie jest
        kosz".
      </Text>

      <Text style={styles.heading}>4. Zakres przetwarzania danych</Text>
      <Text>W ramach korzystania z aplikacji przetwarzane są następujące dane osobowe:</Text>
      <Text style={styles.listItem}>- Adres e-mail użytkownika (za pośrednictwem Clerk).</Text>
      <Text style={styles.listItem}>- Hasło użytkownika (za pośrednictwem Clerk).</Text>
      <Text style={styles.listItem}>
        - Geolokalizacja użytkownika: Dane geolokalizacyjne są wykorzystywane w czasie rzeczywistym
        w celu wyświetlenia pozycji użytkownika na mapie (za pomocą biblioteki Leaflet) oraz do
        zgłoszenia lokalizacji kosza. Dane geolokalizacyjne nie są zapisywane ani przechowywane w
        bazie danych aplikacji poza kontekstem zgłoszenia lokalizacji kosza.
      </Text>
      <Text style={styles.listItem}>
        - Geolokalizacja kosza wskazanego przez użytkownika jest zapisywana w bazie danych i
        upubliczniona po zaakceptowaniu przez administratora.
      </Text>
      <Text style={styles.listItem}>
        - W przyszłych wersjach aplikacji możliwe będzie dodawanie zdjęć do zgłaszanych lokalizacji
        koszy.
      </Text>

      <Text style={styles.heading}>5. Cel przetwarzania danych</Text>
      <Text>Dane osobowe są przetwarzane w następujących celach:</Text>
      <Text style={styles.listItem}>- Rejestracja i uwierzytelnianie użytkownika w aplikacji.</Text>
      <Text style={styles.listItem}>- Utrzymanie i obsługa konta użytkownika w aplikacji.</Text>
      <Text style={styles.listItem}>
        - Weryfikacja zgłoszeń lokalizacji koszy w celu zapewnienia, że są one wysyłane przez
        faktycznych użytkowników aplikacji.
      </Text>

      <Text style={styles.heading}>6. Podstawa prawna przetwarzania danych</Text>
      <Text>Podstawą prawną przetwarzania danych osobowych jest:</Text>
      <Text style={styles.listItem}>
        - Zgoda użytkownika (art. 6 ust. 1 lit. a RODO) wyrażana podczas rejestracji w aplikacji.
      </Text>
      <Text style={styles.listItem}>
        - Niezbędność do wykonania umowy o świadczenie usług drogą elektroniczną (art. 6 ust. 1 lit.
        b RODO), tj. umożliwienie korzystania z funkcji aplikacji wymagających konta użytkownika.
      </Text>

      <Text style={styles.heading}>7. Odbiorcy danych</Text>
      <Text>
        Dane osobowe użytkowników (adres e-mail i hasło) są przetwarzane za pośrednictwem
        zewnętrznego podmiotu, Clerk (
        <Text onPress={() => handleExternalLink('https://clerk.com/')} style={styles.link}>
          https://clerk.com/
        </Text>
        ), który zapewnia mechanizmy rejestracji i uwierzytelniania. Nie korzystam z innych
        zewnętrznych narzędzi ani usług, które miałyby dostęp do danych osobowych użytkowników.
      </Text>

      <Text style={styles.heading}>8. Okres przechowywania danych</Text>
      <Text>
        Dane użytkownika (adres e-mail, hasło oraz ID w bazie danych) będą przechowywane do momentu
        usunięcia konta przez użytkownika lub na jego żądanie.
      </Text>

      <Text style={styles.heading}>9. Realizacja praw użytkownika</Text>

      <Text>Użytkownik ma prawo do:</Text>
      <Text style={styles.listItem}>- Dostępu do swoich danych.</Text>
      <Text style={styles.listItem}>
        - Żądania ich sprostowania, usunięcia lub ograniczenia przetwarzania.
      </Text>
      <Text style={styles.listItem}>- Wycofania zgody na przetwarzanie danych osobowych.</Text>

      <Text>Realizacja tych praw będzie możliwa:</Text>
      <Text style={styles.listItem}>
        - Początkowo poprzez kontakt e-mail na adres patryk.bernasiewicz@gmail.com.
      </Text>
      <Text style={styles.listItem}>
        - W przyszłości poprzez dedykowaną funkcję "Usuń konto" w aplikacji, która usunie dane
        użytkownika zarówno z bazy aplikacji, jak i z systemu Clerk.
      </Text>
      <Text style={styles.heading}>10. Pliki cookies/technologie śledzące</Text>
      <Text>
        Aplikacja "Gdzie jest kosz" nie wykorzystuje dodatkowych plików cookies ani technologii
        śledzących poza mechanizmami wymaganymi przez Clerk.
      </Text>

      <Text style={styles.heading}>11. Informowanie o zmianach polityki prywatności</Text>
      <Text>
        O wszelkich zmianach w Polityce Prywatności użytkownicy będą informowani poprzez komunikat w
        aplikacji, wyświetlany na stronie logowania i rejestracji.
      </Text>
      <Text style={styles.heading}>12. Data wejścia w życie</Text>
      <Text>Niniejsza Polityka Prywatności obowiązuje od dnia 14 kwietnia 2025 roku.</Text>
      <View style={styles.separator} />
      <Text style={styles.summary}>
        Jeśli masz dodatkowe pytania dotyczące Polityki Prywatności, skontaktuj się z
        administratorem danych pod adresem e-mail:{' '}
        <Text style={styles.link} onPress={() => handleMailto('patryk.bernasiewicz@gmail.com')}>
          patryk.bernasiewicz@gmail.com
        </Text>
      </Text>
    </ScrollView>
  );
}
