import { Button, Empty, Input, Carousel, Modal, BackTop } from "antd";
import { ModalType } from "common/enum";
import TodoItem from "components/TodoItem";
import TodoModal from "components/TodoModal";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "store";
import {
  addTodo,
  deleteTodo,
  fetchTodo,
  searchTodo,
  updateTodoContent,
  updateTodoStatus,
} from "store/todo/actions";
import { keepLogin, logout } from "store/user/actions";

import styles from "./index.module.scss";

const mapState = ({ todo, user }: AppState) => ({
  todo,
  user,
});

const mapDispatch = {
  logout,
  keepLogin,
  addTodo,
  deleteTodo,
  fetchTodo,
  searchTodo,
  updateTodoContent,
  updateTodoStatus,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ITodoProps extends PropsFromRedux {}

const Todo: FC<ITodoProps> = ({
  todo,
  user: { userId, username },
  logout,
  deleteTodo,
  fetchTodo,
  updateTodoContent,
  updateTodoStatus,
  addTodo,
  searchTodo,
}) => {
  const [visible, setVisible] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.Add);
  const [modalTitle, setModalTitle] = useState("");
  const [content, setContent] = useState("");
  const [todoId, setTodoId] = useState("");
  const [comfinVisible, setComfinVisible] = useState(false)

  const handleAdd = (content: string) => {
    addTodo(userId, content);
    setFinished(false);
  };

  const handleUpdateContent = (todoId: string, content: string) => {
    updateTodoContent(todoId, content);
  };

  const handleDelete = (todoId: string) => {
    setComfinVisible(true)
    setTodoId(todoId);
    // deleteTodo(todoId);
  };

  const hideModal = () => {
    deleteTodo(todoId);
    setComfinVisible(false)
  }

  const cancelHideModal = () => {
    setComfinVisible(false)
  }

  const handleUpdateStatus = (todoId: string) => {
    updateTodoStatus(todoId);
  };

  const handleSearch = (ev: ChangeEvent<HTMLInputElement>) => {
    searchTodo(userId, ev.target.value);
  };

  const handleCloseModal = () => {
    setVisible(false);
    setContent("");
  };

  const handleOpenModal = (
    type: ModalType,
    todoId?: string,
    content?: string
  ) => {
    setVisible(true);
    if (type === ModalType.Add) {
      setModalTitle("新增待办事项");
      setContent("");
      setModalType(ModalType.Add);
    }
    if (type === ModalType.Edit) {
      setModalTitle("编辑待办事项");
      setModalType(ModalType.Edit);
      setContent(content!);
      setTodoId(todoId!);
    }
  };

  useEffect(() => {
    userId && fetchTodo(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);



  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <span>Hi，{username}</span>
        <Button type="ghost" size="small" onClick={logout}>
          退出
        </Button>
      </div>

      <div className={styles.carousel}>
        <Carousel autoplay>
          <div>
            <h3 className={styles.contentStyle}>
              <img style={{width: '100%', height: '300px'}} src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201211%2F21%2F20121121100635_yPV3U.jpeg&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629874358&t=b22d66f459dfbabdfb6417ff0befe8bd" alt="" />
            </h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>
              <img style={{width: '100%', height: '300px'}} src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201409%2F26%2F130631thhulmlmlm8h7t8t.jpg&refer=http%3A%2F%2Fattach.bbs.miui.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629874358&t=acde06284d8a1a1d3117a6603148c837" alt="" />
            </h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>
            <img style={{width: '100%', height: '300px'}} src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb.zol-img.com.cn%2Fsoft%2F6%2F323%2Fce97Hij7MEKfQ.jpg&refer=http%3A%2F%2Fb.zol-img.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629874358&t=4977e2739aa27b5b91486e3fdea94aee" alt="" />
            </h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>
            <img style={{width: '100%', height: '300px'}} src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201408%2F28%2F173100d33uca3wjm1jmwxk.jpg&refer=http%3A%2F%2Fattach.bbs.miui.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629874358&t=df476c6a4fe6ff12ce326e01f8c5dc46" alt="" />
            </h3>
          </div>
        </Carousel>
      </div>
      <div className={styles.queryBar}>
        <Input
          allowClear
          placeholder="请输入要查询的内容"
          onChange={handleSearch}
        />
        <Button
          type="primary"
          onClick={() => handleOpenModal(ModalType.Add)}
          className={styles.newTodo}
        >
          新增
        </Button>
      </div>
      <div className={styles.main}>
        <ul className={styles.nav}>
          <li
            className={isFinished ? "" : styles.active}
            onClick={() => setFinished(false)}
          >
            <i className={`${styles.dot} ${styles.pending}`} />
            未完成
          </li>
          <li
            className={isFinished ? styles.active : ""}
            onClick={() => setFinished(true)}
          >
            <i className={`${styles.dot} ${styles.resolved}`} />
            已完成
          </li>
        </ul>
        <ul className={styles.list}>
          {todo.length ? (
            todo
              .filter((v) => v.status === isFinished)
              .map((v) => (
                <TodoItem
                  key={v._id}
                  content={v.content}
                  id={v._id}
                  type={modalType}
                  finished={isFinished}
                  onShowModal={handleOpenModal}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))
          ) : (
            <Empty className={styles.noData} />
          )}
        </ul>
      </div>
      <TodoModal
        todoId={todoId}
        modalType={modalType}
        content={content}
        visible={visible}
        title={modalTitle}
        onClose={handleCloseModal}
        onAdd={handleAdd}
        onUpdateContent={handleUpdateContent}
      />
      <Modal
        title="Modal"
        visible={comfinVisible}
        onOk={hideModal}
        onCancel={cancelHideModal}
        okText="确认"
        cancelText="取消"
      >
        <p>确定删除此条数据吗？</p>
      </Modal>
      <BackTop>
      <div className={styles.backTop}>UP</div>
    </BackTop>
    </div>
  );
};

export default connector(Todo);
