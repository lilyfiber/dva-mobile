import styles from './header.css';

const HeaderGQT = () => {
	const goback = () => {
		history.back();
	}

	return (
		<header className={styles.header} onClick={goback}>
			<div className={styles.content}>
				<img className={styles.left} src={require("../../assets/top_gqt_logo.jpg")} />
				<img className={styles.right} src={require("../../assets/top_gqt_flag.jpg")} />
			</div>
		</header>
	);
}

export default HeaderGQT;